#include "app.h"

Tool tool;
File file;

int main(int argc, char const *argv[])
{

	if ( argc == 1 )
	{
		cout << "hi" << endl;
		return 0;
	}

	if ( string(argv[1]) == "console" )
	{
		SetWindowPos(GetForegroundWindow(), NULL, 1920-400, -32, 400 + 25, 1080, SWP_SHOWWINDOW);
	}
	else if ( string(argv[1]) == "center" ) {
		SetWindowPos(GetForegroundWindow(), NULL, 1920/2-400,1080/2-300,800,600, SWP_SHOWWINDOW);
	}
	else if ( string(argv[1]) == "-v" ) {
		cout << "version: " << "1" << endl;
	}
	else if ( string(argv[1]) == "init" ) {
		string path = file.getPath();
		tool.strArrSub(path, "\\");
		tool.strArrSub(path, "\\");
		path += "code\\";
		string pathBin = path;
		tool.strArrSub(pathBin, "\\");
		pathBin += "bin\\";
		system(string("g++ "+path +"create\\app.cpp -o "+pathBin+"create").c_str());
		cout << "done-->" << tool.color(11, [pathBin]() {cout << pathBin+"create.exe";}) << endl;
		system(string("g++ "+path +"nodejs\\app.cpp -o "+pathBin+"nodejs").c_str());
		cout << "done-->" << tool.color(11, [pathBin]() {cout << pathBin+"nodejs.exe";}) << endl;
		system(string("g++ "+path +"chromejs\\app.cpp -o "+pathBin+"chromejs").c_str());
		cout << "done-->" << tool.color(11, [pathBin]() {cout << pathBin+"chromejs.exe";}) << endl;
		system(string("g++ "+path +"pack\\app.cpp -o "+pathBin+"pack").c_str());
		cout << "done-->" << tool.color(11, [pathBin]() {cout << pathBin+"pack.exe";}) << endl;

	}
	
	return 0;
}