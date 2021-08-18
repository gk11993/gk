#include "app.h"
#include <iostream>
#include <vector>

using namespace std;
Tool tool;
File file;
Json json;

void getJson()
{
	string objectDir(file.getCurrDir());
	string jsonString;
	file.read(objectDir+"\\package.json", jsonString);
	json.parse(jsonString);
}

int main(int argc, char const *argv[])
{
	Time t;
	t.begin();

	getJson();
	string gpp = "g++";
	vector<string> keys = {"empty", "dll", "message"};

	int index = tool.findKey(keys, json << "type");
	if ( index == -1 )
	{
		cout << "failed to not find package.json in type. trying empty" << endl;
		index = 0;
	}

	string staticStr = "";
	if ( (json << "static") == "1" )
	{
		staticStr = "-static";
	}

	string libws2 = "";
	if ( (json << "libws2") == "1" )
	{
		libws2 = "-lws2_32 ";
	}
	if ( index == 2 )
	{
		index = 0;
	}

	string strand = "";
	string objectDir(file.getCurrDir()+"\\"+"app");
	int i = 0;
	if ( argc > 1 )
	{
		i = atoi(argv[1]);
		if ( i == 0 ) i = -1;
		if ( string(argv[1]) == "-help" ) i = 0;
		switch( i )
		{
			case 0:
			cout << "[0, 1, 2, 3, 4, 5]{notrun, ii, s, o, exe, ii+s}" << endl;
			break;
			case 1:
			strand = gpp + " app.cpp "+libws2+" -o app.ii -E";
			break;
			case 2:
			strand = gpp + " app.ii "+libws2+" -o app.s -S";
			break;
			case 3:
			strand = gpp +" app.s "+libws2+" -o app.o -c";
			break;
			case 4:
			strand = gpp +" app.o "+libws2+" -o app";
			break;
		}
		if ( i > 0 &&  i < 5 ) {
			if ( i == 4 && index == 1 )
			{
				strand = gpp +" --share app.o "+ libws2 +" -o app.dll";
			}
			system(strand.c_str());
		}
		//encode to assembly
		if ( atoi(argv[1]) == 5 ) {
			system(string(gpp + " app.cpp "+libws2+" -o app.ii -E").c_str());
			system(string( gpp + " app.ii "+libws2+" -o app.s -S").c_str());
			system(string("subl "+objectDir+".s").c_str());
		}
		
	} else if ( argc == 1 ) {
		switch (index)
		{
			case 0:
				system(string(gpp + " app.cpp "+libws2+" -o app.exe "+ staticStr).c_str());
				system(objectDir.c_str());
			break;
			case 1:
				system(string(gpp+" --share app.cpp "+ libws2 +" -o app.dll "+ staticStr).c_str());
				cout << "compile finish, but this program cannot be run in alone" << endl;
			break;
		}
	}

	//not run
	if ( i == -1 ) {
		if ( index == 1 )
		{
			system(string(gpp + " --share app.cpp "+ libws2 +" -o app.dll "+ staticStr).c_str());
		} else {
			system(string(gpp + " app.cpp "+libws2+" -o app.exe "+ staticStr).c_str());
		}
	}

	cout <<"[Finished in " << t.ends() << "s, v: 3]" << endl;
	return 0;
}