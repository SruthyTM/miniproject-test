import traceback
import sys

print("Python version:", sys.version)

try:
    print("Importing app.database...")
    import app.database
    print("DB OK")
    
    print("Importing app.security...")
    import app.security
    print("Security OK")
    
    print("Importing app.models...")
    import app.models
    print("Models OK")
    
    print("Importing app.schemas...")
    import app.schemas
    print("Schemas OK")
    
    print("Importing app.main...")
    import app.main
    print("Main OK")
except Exception:
    traceback.print_exc()
