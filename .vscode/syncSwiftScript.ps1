Clear-Host

# Get all git remotes
$allGetRemotes = git remote -v

function GetAllRemotes {
    param (
        $AllGetRemotes # all remotes
    )
    $allRemotes = @()

    # loop all founded remotes
    foreach($remote in $allGetRemotes) {
        $remote = $remote.TrimStart()
        $splittedRemote = $remote -split "	"
    
        if ($allRemotes -notcontains $splittedRemote[0]) {
            # -> remote already NOT exists in remote
            $length = $allRemotes.Length
            $allRemotes += $splittedRemote[0]
            Write-Host "[$($length)] $($splittedRemote[0])"
        }
    }

    return $allRemotes
}

# Source branch BEGIN
Write-Host "Select the source remote"
$allRemotes = GetAllRemotes -AllGetRemotes $AllGetRemotes

# loop the input -> valid user input
do {
    $selSourceRemote = Read-Host -Prompt "Enter a number"
    if ([regex]::IsMatch($selSourceRemote, "^\d+$")) {
        # -> user input is a number
        if ($selSourceRemote -lt $allRemotes.length) {
            # -> user input exists in array
            #   -> SUCCESS
            break
        } else {
            # -> user input NOT exists in array
            #   -> ERROR
            Write-Host "Invalid input. Please enter a number less than $($allRemotes.length)."
        }
      } else {
        # -> user input is NOT a number
        #   -> ERROR
        Write-Host "Invalid input. Please enter a number only."
      }
} while ($true)

$sourceRemote = $allRemotes[$selSourceRemote]
# Source branch END

# Target branch BEGIN
Write-Host "Select the target remote"
$allRemotes = GetAllRemotes -AllGetRemotes $AllGetRemotes

# loop the input -> valid user input
do {
    $selTargetRemote = Read-Host -Prompt "Enter a number"
    if ([regex]::IsMatch($selTargetRemote, "^\d+$")) {
        # -> user input is a number
        if ($selTargetRemote -lt $allRemotes.length) {
            # -> user input exists in array
            if ($selTargetRemote -eq $selSourceRemote) {
                # -> user input is source remote
                #   -> ERROR
                Write-Host "Invalid input. Please use not the same remotes as source and target."
            } else {
                # -> user input is NOT source remote
                #   -> SUCCESS
                break
            }
        } else {
            # -> user input NOT exists in array
            #   -> ERROR
            Write-Host "Invalid input. Please enter a number less than $($allRemotes.length)."
        }
      } else {
        # -> user input is NOT a number
        #   -> ERROR
        Write-Host "Invalid input. Please enter a number only."
      }
} while ($true)

$targetRemote = $allRemotes[$selTargetRemote]
# Target branch END

# syncSwiftScript main action BEGIN
$currBranch = git rev-parse --abbrev-ref HEAD # Current branch
git pull --all # get all changes from all remotes
$branches = git branch -r

# loop at all branches
foreach($branch in $branches) {
    $branch = $branch.TrimStart()
    $splittedRemote = $branch -split "/"

    if ($splittedRemote[0] -eq $sourceRemote) {
        # -> branch is from the source remote
        git checkout $splittedRemote[1]
        git pull
    }

    Write-Output $branch
}
# syncSwiftScript main action END

# checkout to current branch
git checkout $currBranch
git push $targetRemote --all