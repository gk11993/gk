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
	
	return 0;
}