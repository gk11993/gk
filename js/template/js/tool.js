function openNewindow(filename, width=600, height=400)
{
	window.open (filename, 'newwindow', 'height='+height+', width='+width+', top='+(window.screen.height/2-height/2)+', left='+(window.screen.width/2-width/2)+', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
}