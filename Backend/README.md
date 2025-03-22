# NutritionApp Backend

# Development

The next commands are wrriten to unix based systems. If you are using windows, figure it out yourself :P

First thing - enter the backend directory:
```bash
cd Backend
```

### To open in vscode run the next command: (you need to have vscode installed and setup the code command)
```bash
code .
```

### To install the dependencies run the next command:
```bash
poetry install
```

### To load the environment in vscode:
 click command + shift + p (mac) and type: "Python: Select Interpreter" and select "Python 3.12.5 64-bit ('3.12.5': pyenv)".

### To add a new dependency run the next command:
```bash
poetry add <dependency>
```

### To run the server locally run the next command:
```bash
poetry run start
```

### To open swagger documentation go to:
```
http://localhost:8000/docs
```
You can test the API from there. (send http requests to the server with the required parameters)
