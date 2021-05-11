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
	void getAllFiles(string, vector<string>&);
	string getPath();
	string getCurrDir();
	void readFile(string, string &);
	void writeFile(string, const string &);

};
File::File()
{
	
}

File::~File()
{

}

void File::writeFile(string path, const string &text)
{
	ofstream ofs;
	ofs.open(path, ios::out);
	ofs<< text;
	ofs.close();
}

void File::readFile(string path, string &result)
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

void File::getAllFiles(string path, vector<string>& files) 
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

// DeleteFileW(L"C:\\Users\\Administrator\\Desktop\\新建文本文档 (4).txt");
// CopyFileW(L"C:\\Users\\Administrator\\Desktop\\新建文本文档 (4).txt", L"C:\\Users\\Administrator\\Desktop\\win\\新建文本文档 (4).txt", false);
// MoveFileW(L"C:\\Users\\Administrator\\Desktop\\新建文本文档 (4).txt", L"C:\\Users\\Administrator\\Desktop\\win\\111.txt");
// CreateDirectory("1", NULL);
// writeFile("file.txt", "1111");
// string *p = new string;
// readFile("file.txt", *p);
// delete p;
// getCurrDir()
// getPath()
