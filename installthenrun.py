#TODO: Linux support

import sys

print(sys.platform)

if sys.platform.startswith('win32'):
    import os

    os.system("npm install")
    os.system("npm run dev")
else:
    input("Non windows os detected")