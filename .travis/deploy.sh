#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")/.." \
    || exit 1

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

prepare_site_dist_dir() {
    declare -r files=(
        kcd-webhook-service
        extensions.csproj
        host.json
        package.json
        proxies.json
    )

    for file in "${files[@]}"; do
        cp -R "$file" "$TMP_DIR"
    done
}

update_website() {
    # Move to temp folder
    cd "$TMP_DIR"

    GITHUB_COMMIT=`curl -s "https://api.github.com/repos/$TRAVIS_REPO_SLUG/commits/$TRAVIS_COMMIT"`
    echo $GITHUB_COMMIT

    COMMIT_AUTHOR=`jq '.value.commit.author.name'`
    echo $COMMIT_AUTHOR

    {
        git config --global user.email "$GIT_USER_EMAIL" \
          && git config --global user.name "$COMMIT_AUTHOR" \
          && git init \
          && git add -A \
          && git commit --message "$TRAVIS_COMMIT_MESSAGE" \
          && git push --quiet --force --set-upstream "https://$GIT_USER_NAME:$GIT_PASSWORD@$GIT_DESTINATION" master
    } || {
        exit 1
    }
}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Only execute the following if the commit is made to the `master` or `develop` branches
if [ "$TRAVIS_BRANCH" == "master" ]; then
    GIT_DESTINATION=$GIT_DESTINATION_MASTER
elif [ "$TRAVIS_BRANCH" == "develop" ]; then
    GIT_DESTINATION=$GIT_DESTINATION_DEVELOP
else
    exit 0
fi

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

main () {
    declare -r TMP_DIR="$(mktemp -d XXXXX)"

    prepare_site_dist_dir \
        && update_website

    rm -rf "$TMP_DIR"
}

main "$@"