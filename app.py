import platform
import sys

import eel

# Use latest version of Eel from parent directory
sys.path.insert(1, '../../')

@eel.expose  # Expose function to JavaScript
def say_hello_py(x):
    """Print message from JavaScript on app initialization, then call a JS function."""
    print('Hello from %s' % x)  # noqa T001
    eel.say_hello_js('Python {from within say_hello_py()}!')

@eel.expose
def hello_world():
    return "Hello from python"


@eel.expose
def print_string(string):
    if len(string) > 20:
        print(string)
        return "Success!"
    else:
        return "Too few characters. Please type more than 20 characters."


# eel.init('web')
# eel.start('index.html', mode='electron', size=(600, 400))

def start_eel(develop):
    """Start Eel with either production or development configuration."""
    #
    # if develop:
    #     print("Development Mode")
    #     directory = 'src'
    #     # app = None
    #     page = {'port': 8080}
    # else:
    #     print("Production Mode")
    directory = 'compiled'
    #     # app = None
    #     page = {'port': 8080}
    # app = 'electron'
    # page = 'index.html'

    eel.init(directory)
    say_hello_py('Python World!')
    eel.say_hello_js('Python World!')  # Call a JavaScript function (must be after `eel.init()`)

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        # size=(1280, 800),
    )
    try:
        # eel.start(page, mode=app, **eel_kwargs)
        eel.start(**eel_kwargs)

    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start(page, mode='edge', **eel_kwargs)
        else:
            raise


if __name__ == '__main__':
    import sys

    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)
