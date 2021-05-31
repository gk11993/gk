#include <io.h>
#include <fstream>
#include <vector>
#include <iostream>
using namespace std;
class File
{
public:
	File();
	~File();
	void getAll(string, vector<string>&);
	string getPath();
	string getCurrDir();
	void read(string, string &);
	void write(string, const string &);

};
File::File()
{
	
}

File::~File()
{

}

void File::write(string path, const string &text)
{
	ofstream ofs;
	ofs.open(path, ios::out);
	ofs<< text;
	ofs.close();
}

void File::read(string path, string &result)
{
	ifstream ifs;
	ifs.open(path, ios::in);
 	string str((istreambuf_iterator<char>(ifs)), istreambuf_iterator<char>());
 	result = str;
	ifs.close();
}
string File::getCurrDir()
{
	char ExePath[MAX_PATH];
	GetCurrentDirectory(MAX_PATH, ExePath);
	return ExePath;
}
string File::getPath()
{
	char ExePath[MAX_PATH];
	GetModuleFileName(NULL, ExePath, MAX_PATH);
	return ExePath;
}

void File::getAll(string path, vector<string>& files) 
{
	long hFile = 0;
	struct _finddata_t fileinfo;  
	string p;
	if ((hFile = _findfirst(p.assign(path).append("\\*").c_str(), &fileinfo)) != -1) {
		do {
			files.push_back(p.assign(path).append("\\").append(fileinfo.name));

		   } while (_findnext(hFile, &fileinfo) == 0);

		_findclose(hFile);
	}
}

