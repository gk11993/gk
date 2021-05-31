#include <iostream>
using namespace std;
#include <vector>

class Json
{
private:
	int findKey(string);
	int findJsonKey(string);
	static long long indexOf(string &, string);
	static void decorate(string &);
	static void deEmpty(string&);
	static string& inDecorate(string &);
	static void split(string&, string, vector<string>&);
	static string getChunk(string&, string&);
	int index = 0;
public:
	Json();
	~Json();
	vector<string> keys;
	string value;
	vector<string> values;
	vector<string> jsonKeys;
	Json* jsonValue;
	vector<Json*> jsons;

	int pushState = 0;//0: string, 1: Json
	
	Json& operator<(string);
	Json& operator/(string);
	Json& operator/(Json*);
	string operator<<(string);

	
	void parse(string&);
	void stringify(string&);
	string stringify();
};


// int main(int argc, char const *argv[])
// {
// 	//SetWindowPos(GetForegroundWindow(), NULL, 1920/2-400,1080/2-300,800,600, SWP_SHOWWINDOW);
	
// 	Json *addr_begin = new Json;
// 	cout << addr_begin << endl;


// 	Json *json = new Json;
// 	string strand = "{\"show\": \"hello\", \"json\": {\"choochoo\": \"thing\", \"look\": {\"isInto\": \"yes\"} , \"look1\": {\"isInto\": \"yes1\"} }, \"No.\": 0, \"msg\": \"welecome\"}";
	
// 	json->parse(strand);
// 	Json &train = (*json < "json");
// 	train / "train" / "choochoo";
// 	Json *flesh = new Json;
// 	Json &js = *flesh / "Can I get in" / "hi";
// 	train / &js / "look2";

// 	cout << (train<< "choochoo") << endl;
// 	cout << ( (train< "look2") << "hi") << endl;
// 	cout << ( (*json < "json" < "look") << "isInto") << endl;
	
// 	string result;
// 	json->stringify(result);
// 	cout << result << endl;

// 	delete json;
	

// 	Json *addr_end = new Json;
// 	cout << addr_end << endl;
// 	return 0;
// }
Json::Json()
{

}
Json::~Json()
{
	for (int i = 0; i < jsons.size(); ++i)
	{
		delete jsons[i];
	}
}
int Json::findKey(string key)
{
	for (int i = 0; i < keys.size(); ++i)
	{
		if ( keys[i] == key )
		{
			return i;
		}
	}
	return -1;
}
int Json::findJsonKey(string key)
{
	for (int i = 0; i < jsonKeys.size(); ++i)
	{
		if ( jsonKeys[i] == key )
		{
			return i;
		}
	}
	return -1;
}

Json& Json::operator/(string str)
{
	if ( (index % 2) == 0 )
	{
		value = str;
		pushState = 0;
	} else {
		int index = findKey(str);
		if ( index != -1 )
		{
			int jkeyIndex = findJsonKey(str);
			if (jkeyIndex  != -1 )
			{
				delete jsons[jkeyIndex];
				jsons[jkeyIndex] = jsonValue;
			} else {
				values[index] = value;
			}
		} else {
			keys.push_back(str);
			if ( pushState == 0 )
			{
				values.push_back(value);
			} else {
				jsons.push_back(jsonValue);
				jsonKeys.push_back(str);
				values.push_back(" ");
			}
		}
	}
	index++;
	return *this;
}
Json& Json::operator/(Json* json)
{
	if ( (index % 2) == 0 )
	{
		jsonValue = json;
		pushState = 1;
	}
	index++;
	return *this;
}


Json& Json::operator<(string key)
{
	int index = findJsonKey(key);

	if ( index != -1 )
	{
		return *jsons[index];
	}

	return *this;
}
string Json::operator<<(string key)
{
	int index = findKey(key);
	if ( index != -1 )
	{
		return values[index];
	}
	return "";
}

long long Json::indexOf(string & str, string pattern)
{
	return str.find(pattern);
}

void Json::decorate(string & str)
{
	int begin = indexOf(str, "{");
	int end = str.rfind("}");
	str = str.substr(begin+1, end-1);
}

void Json::deEmpty(string& str)
{
	for (int i = 0; i < str.length(); ++i)
	{
		if ( str[0] == ' ' || str[0] == '\n' || str[0] == '\t' )
		{
			str.replace(0, 1, "");
		} else {
			break;
		}
	}
	for (int i = str.length()-1; i >=0; --i)
	{
		if ( str[i] == ' ' || str[i] == '\n' || str[i] == '\t' )
		{
			str.replace(i, 1, "");
		} else {
			break;
		}
	}
}

string& Json::inDecorate(string & str)
{
	deEmpty(str);
	if ( str[0] == '\"' )
	{
		str.replace(0, 1, "");
	}
	if ( str[str.length()-1] == '\"' )
	{
		str.replace(str.length()-1, 1, "");
	}
	
	return str;
}

void Json::split(string &str, string pattern, vector<string> & result)
{
    str += pattern;
    int size = str.size();
    for (int i = 0; i < size; i++)
    {
        int pos = str.find(pattern, i);
        if (pos < size)
        {
            string s = str.substr(i, pos - i);
            if ( s.length() ) result.push_back(s);
            i = pos + pattern.size() - 1;
        }
    }
}

string Json::getChunk(string& str, string& chunk)
{
	int end = 0;
	int begin = indexOf(str, "{");
	int n = 1;
	for (int i = begin+1; i < str.length(); ++i)
	{
		if ( str[i] == '}')
		{
			n -= 1;
		} else if ( str[i] == '{') {
			n += 1;
		}
		if ( n == 0 )
		{
			end = i;
			break;
		}
	}

	chunk = str.substr(begin, end - begin+1);
	//cout << chunk << endl;

	int keyEnd = str.rfind("\"", begin)-1;
	int keyBegin = str.rfind("\"", keyEnd);
	//cout << keyBegin<<"\t"<<keyEnd << endl;

	string key = str.substr(keyBegin+1, keyEnd-keyBegin);
	//cout << key << endl;
	str.replace(begin, end-begin+1, " ");
	//cout << str << endl;
	return key;
}

void Json::parse(string & str)
{
	decorate(str);
	while (1)
	{
		if ( indexOf(str, "{") == -1 )
		{
			break;
		}

		string chunk;
		string key = getChunk(str, chunk);

		Json *json = new Json;
		json->parse(chunk);
		jsons.push_back(json);
		jsonKeys.push_back(key);
	}
	
	vector<string> list;
	

	
	split(str, ",", list);
	for (int i = 0; i < list.size(); ++i)
	{
		vector<string> result;
		split(list[i], ":", result);
		if ( result.size() >= 2 )
		{
			keys.push_back(inDecorate(result[0]));
			values.push_back(inDecorate(result[1]));
		}
	}
}

void Json::stringify(string& str)
{
	str += "{";
	for (int i = 0; i < keys.size(); ++i)
	{
		str += "\"" + keys[i] + "\": ";

		bool isJsons = false;
		for (int j = 0; j < jsonKeys.size(); ++j)
		{
			if ( keys[i] == jsonKeys[j] )
			{
				isJsons = true;
				jsons[j]->stringify(str);
			}
		}

		if ( !isJsons )
		{
			str += "\"" + values[i] + "\"";
		}

		if (i < keys.size() - 1)
		{
			str +=  ", ";
		} 
	}
	str += "}";
}
string Json::stringify()
{
	string str;
	stringify(str);
	return str;
}
