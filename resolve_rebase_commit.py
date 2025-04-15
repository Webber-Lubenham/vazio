import subprocess

commit_msg = """Resolve merge conflicts and update frontend files before push
"""

with open(".git/COMMIT_EDITMSG", "w") as f:
    f.write(commit_msg)

try:
    result = subprocess.run(["git", "rebase", "--continue"], capture_output=True, text=True)
    print("STDOUT:")
    print(result.stdout)
    print("STDERR:")
    print(result.stderr)
except Exception as e:
    print(f"Error running git rebase --continue: {e}")
