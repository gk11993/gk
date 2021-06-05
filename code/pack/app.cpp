#include "app.h"
#include <iostream>
#include <vector>

using namespace std;
Tool tool;
File file;
Json json;
vector<string> getName(string dir)
{
	vector<string> s;
	vector<string> names;
	file.getAll(dir, s);
	for (int i = 0; i < s.size(); ++i)
	{
		if ( (tool.indexOf(s[i], ".cpp") != -1) || tool.indexOf(s[i], ".dll") != -1 )
		{
			vector<string> dir = tool.split(s[i], "\\");
			names.push_back(dir[dir.size()-1]);
		}
	}
	return names;
}
string getGKstrand()
{
	string objectDir(file.getCurrDir());
	vector<string> names = getName(objectDir);
	
	string g = "g++ ";
	for (int i = 0; i < names.size(); ++i) g += names[i]+" ";
	return g;
}

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
	vector<string> keys = {"empty", "dll", "message"};

	int index = tool.findKey(keys, json << "type");
	if ( index == -1 )
	{
		cout << "failed to not find package.json in type" << endl;
		return 0;
	}

	string libws2 = "";
	if ( index == 2 ) {
		libws2 = "-lws2_32 ";
		index = 0;
	}

	string gStrand = getGKstrand();
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
			cout << "[0, 1, 2, 3, 4, 5||-s]{notrun, ii, s, o, exe, ii+s}" << endl;
			break;
			case 1:
			gStrand += libws2+"-o app.ii -E";
			break;
			case 2:
			gStrand = "g++ app.ii "+libws2+"-o app.s -S";
			break;
			case 3:
			gStrand = "g++ app.s "+libws2+"-o app.o -c";
			break;
			case 4:
			gStrand = "g++ app.o "+libws2+"-o app";
			break;
		}
		if ( i > 0 &&  i < 5 ) {
			if ( i == 4 && index == 1 )
			{
				gStrand = "g++ --share app.cpp -o app.dll";
			}
			system(gStrand.c_str());
		}
		//encode to assembly
		if ( string(argv[1]) == "-s" || atoi(argv[1]) == 5 ) {
			gStrand += libws2+"-o app.ii -E";
			system(gStrand.c_str());
			system(string("g++ app.ii "+libws2+"-o app.s -S").c_str());
			//open build file at sublime 
			system(string("subl "+objectDir+".s").c_str());
		}
		
	} else if ( argc == 1 ) {
		switch (index)
		{
			case 0:
				gStrand += libws2+"-o app";
				system(gStrand.c_str());

				// break looping
				if ( tool.indexOf(file.getPath(), objectDir) != 0 )
					system(objectDir.c_str());
			break;
			case 1:
				system(string("g++ --share app.cpp -o app.dll").c_str());
				cout << "compile finish, but this program cannot be run in alone" << endl;
			break;
		}
	}

	if ( i == -1 ) {
		if ( index == 1 )
		{
			system(string("g++ --share app.cpp -o app.dll").c_str());
		} else {
			gStrand += libws2+"-o app";
			system(gStrand.c_str());
		}
	}

	cout <<"[Finished in " << t.ends() << "s, v: 2]" << endl;
	return 0;
}