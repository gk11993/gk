#include <iostream>
#include <winsock2.h>
#pragma comment(lib, "ws2_32")
using namespace std;
#include <thread>
#include <sstream>
#include "app.h"
Tool tool;
File file;
Json json;

class Message
{
public:
	Message();
	~Message();
	static void getMessage(void (*)(vector<string>&, Json&));
	void postMessage(string, short, Json&);
	void live();
	sockaddr_in postAddr;
};
void getMessageLoop(vector<string>&, Json&);
int main(int argc, char const *argv[])
{
	Message *message = new Message;
	thread(message->getMessage, getMessageLoop).detach();
	// Json postResponseJson;
	// message->postMessage("/CanYouSeeMe/home", 4444, postResponseJson);
	// string stringJson;
	// postResponseJson.stringify(stringJson);
	// cout << stringJson << endl;




	message->live();
	delete message;
	return 0;
}
void getMessageLoop(vector<string>& args, Json& resultJson)
{




	cout << (resultJson / "Welecome" / args[1]).stringify() << endl;
}


Message::Message()
{
	WSADATA wsdata;
	WSAStartup(MAKEWORD(2, 2), &wsdata);

 	postAddr.sin_family = AF_INET;
	char hostname[256];
	gethostname(hostname, sizeof(hostname));
	hostent* p = gethostbyname(hostname);
	memcpy(&postAddr.sin_addr, p->h_addr, 4);
}
Message::~Message()
{
	WSACleanup();
}

void Message::getMessage(void (*t)(vector<string>&, Json&))
{
	SOCKET server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
	sockaddr_in getAdde;
	getAdde.sin_family = AF_INET;
	getAdde.sin_port = htons(80);
	getAdde.sin_addr.s_addr = INADDR_ANY;

	bind(server, (sockaddr *)&getAdde, sizeof(getAdde));
	listen(server, 2);
	
	sockaddr_in claddr;
	int addrLen = sizeof(claddr);
	char revdata[1024] = "";
	while (1)
	{
		SOCKET client = accept(server, (sockaddr *)&claddr, &addrLen);
		
		recv(client, revdata, 1024, 0);

		string str(revdata);
		str = str.substr(4, tool.indexOf(str, "HTTP")-5);
		vector<string> vstr = tool.split(str, "/");
		if ( !(vstr.size() < 2) )
		{
			
			Json resultJson;
			t(vstr, resultJson);
			string result;
			resultJson.stringify(result);

			string responseHeader = "HTTP/1.1 200 OK\r\n";
			responseHeader += "Content-Type: application/json\r\n\r\n";
			responseHeader += result;
			
			send(client, responseHeader.c_str(), responseHeader.length(), 0);
		} else {
			cout << "url: " << tool.color(13, [revdata]() { cout << string(revdata).substr(4, tool.indexOf(string(revdata), "HTTP")-5); }) << endl;
			char sendata[11] = "don't open";
			send(client, sendata, 10, 0);
		}
		closesocket(client);
	}
	closesocket(server);
}
void Message::postMessage(string url, short port, Json& json)
{
	SOCKET server = socket(AF_INET, SOCK_STREAM, 0);

	postAddr.sin_port = htons(port);
	stringstream requestHeader;
	requestHeader << "GET ";
	requestHeader << url;
	requestHeader << " HTTP/1.0\r\n";
	requestHeader << "Host: 127.0.0.1:";
	requestHeader << port;
	requestHeader << "\r\n";
	requestHeader << "Connection: close\r\n\r\n";

	connect(server, (sockaddr*)&postAddr, sizeof(postAddr));
	
	send(server, requestHeader.str().c_str(), sizeof(requestHeader), 0);
	char revdata[1024] = { 0 };
	recv(server, revdata, sizeof(revdata), 0);
		
	string str(revdata);
	str = str.substr(tool.indexOf(str, "{"), str.rfind("}"));
	json.parse(str);
}

void Message::live()
{
	while(1) {}
}