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
void subDir(string &path)
{
	vector<string> dir = tool.split(path, "\\");

	path.replace(tool.indexOf(path, dir[dir.size()-1]), path.size(), "");
}
string getTemplateDir(string dirName)
{
	string path = file.getPath();
	subDir(path);
	subDir(path);

	vector<string> files;
	path += "js\\"+ dirName +"\\";
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
	 
	if ( argc == 1 )
	{
		cout << "warnig: anchor is empty" << endl;
		return 0;
	}

	if ( argc == 2 )
	{
		if ( string(argv[1]) == "-help" )
		{
			cout << "this is about chrome_extensions frame" << endl;
			return 0;
		}
	}
	if ( argc == 3 )
	{
		if ( string(argv[1]) == "create" )
		{
			string objectDir = getObjectDir(argv[2]);
			string templateDir = getTemplateDir("chrome-extend");
			moveFile(objectDir, templateDir, 1);
		}
		
	}
	
	cout << "[------------done----version: 1]"<< endl;
	return 0;
}