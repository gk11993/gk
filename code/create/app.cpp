#include "app.h"
#include <iostream>
#include <vector>
#include <windows.h>

using namespace std;
Tool tool;
File file;
Json json;
string getObjectDir(string name)
{
	string object = file.getCurrDir()+"\\"+name;
	cout << "::object " << endl;
	cout << "::name--> " << tool.color(13, [name](){cout << name;}) << endl;
	json / name / "neme";

	CreateDirectory(object.c_str(), NULL);
	return object; 
}


string getTemplateDir(string dirName)
{
	string path = file.getPath();
	tool.strArrSub(path, "\\");
	tool.strArrSub(path, "\\");

	vector<string> files;
	path += "cpp\\"+ dirName +"\\";
	return path;
}
void moveFile(string objectDir, string templateDir, int index)
{
	vector<string> files;
	file.getAll(templateDir, files);
	for (int i = 0; i < files.size(); ++i)
	{
		if (  (files[i][files[i].length()-1] !='.') )
		{
			vector<string> names = tool.split(files[i], "\\");
			string name = names[names.size()-1];
			string t = "";
			for (int i = 0; i < index; ++i) t += "\t";
			cout << t << "copy: " << tool.color(14, [name](){ cout << name; }) << endl;
			if ( tool.indexOf(name, ".") == -1 )
			{
				CreateDirectory(string(objectDir+"\\"+name).c_str(), NULL);
				index++;
				moveFile(objectDir+"\\"+name, templateDir+"\\"+name, index);
				index--;
			} else {
				CopyFile(string(templateDir+"\\"+name).c_str(), string(objectDir+"\\"+name).c_str(), false);
			}
		}
	}
}

int main(int argc, char const *argv[])
{
	//create 
	if ( argc == 1 )
	{
		cout << "warnig: object not name to create " << endl;
		return 0;
	}

	vector<string> projects = {"-e", "-d", "-m"};
	vector<string> keys = {"empty", "dll", "message"};

	//json / "" / "x";
	json / "0" / "libws2";
	json / "0" / "static";

	if ( argc == 2 )
	{
		if ( string(argv[1]) == "-help" )
		{
			cout << "name { -e: empty, -d: dll, -m: message }" << endl;
			return 0;
		}
		json / "empty" / "type";
	}
	if ( argc > 2 )
	{
		int index = tool.findKey(projects, argv[2]);
		if ( index != -1 )
		{
			json / keys[index] / "type";
			if ( index == 2 )
			{
				json / "1" / "libws2";
			}
		} else {
			cout << "warnig: not project " << endl;
			return 0;
		}
	}
	
	string objectDir = getObjectDir(argv[1]);
	cout << "::type--> " << tool.color(13, [](){cout << (json << "type");}) << endl;
	string templateDir = getTemplateDir("template");
	moveFile(objectDir, templateDir, 1);

	
	string projectDir = getTemplateDir("project");
	string projectFileText;
	file.read(projectDir+"\\"+(json << "type")+".cpp", projectFileText);
	file.write(objectDir+"\\"+(json << "name")+"\\app.cpp", projectFileText);
	cout << "\t" << "create: " << tool.color(14, [](){ cout << "app.cpp"; }) << endl;
	string jsonString;
	json.stringify(jsonString);
	file.write(objectDir+"\\"+(json << "name")+"\\package.json", jsonString);
	cout << "\t" << "create: " << tool.color(14, [](){ cout << "package.json"; }) << endl;

	
	cout << "[------------done----version: 6]"<< endl;
	return 0;
}