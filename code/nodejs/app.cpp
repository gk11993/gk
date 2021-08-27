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

void mainAppend(string name, string& buff)
{
	string main = file.getCurrDir()+"\\rain\\main.js";
	
	string str;
	file.read(main, str);
	string needStr = str.substr(0, str.size()-2);
	needStr += "\t"+name+": async _=> await require('./"+name+"')(_),\n}\n";
	file.write(main, needStr);

	string newFile = file.getCurrDir()+"\\rain\\"+name+".js";

	file.write(newFile, "\nmodule.exports = async _=> {\n\t\n}\n");
	buff = newFile;
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
			cout << "nothing" << endl;
			return 0;
		}
	}
	if ( argc == 3 )
	{
		if ( string(argv[1]) == "create" )
		{
			cout << "enter" << endl;
			string objectDir = getObjectDir(argv[2]);
			string templateDir = getTemplateDir("template");
			moveFile(objectDir, templateDir, 1);
		}
		else if ( string(argv[1]) == "append" )
		{
			string buff;
			mainAppend(argv[2], buff);
			cout << buff << endl;
			system(string("subl "+buff).c_str());
		}
	}
	
	cout << "[------------done----version: 2]"<< endl;
	return 0;
}