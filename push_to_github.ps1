$GIT_PATH = "C:\Program Files\Git\cmd\git.exe"

# 1. Initialize Git
& $GIT_PATH init

# 2. Add files
& $GIT_PATH add .

# 3. Configure Git user temporarily (needed for first commit if not set)
& $GIT_PATH config user.email "alfacomp@example.com"
& $GIT_PATH config user.name "AlfaComp"

# 4. Commit
& $GIT_PATH commit -m "Upload AlfaComp shop code with new Tabs and Products"

# 5. Set branch to main
& $GIT_PATH branch -M main

# 6. Add remote
& $GIT_PATH remote add origin "https://github.com/alfacompofficial-del/alfacomp-test-version.git"

# 7. Push! This might open a browser window for login.
& $GIT_PATH push -u origin main
