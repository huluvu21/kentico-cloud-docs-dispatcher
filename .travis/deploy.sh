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

    git config --global user.email "$GIT_USER_EMAIL" \
        && git config --global user.name "$GIT_USER_NAME" \
        && git init \
        && git add -A \
        && git commit --message "Hey server, this content is for you!" \
        && git push --quiet --force --set-upstream "https://$GIT_USER_NAME:$GIT_PASSWORD@$GIT_DESTINATION" master
}

remove_sensitive_information() {

    declare -r CENSOR_TEXT="[secure]";

    while IFS="" read -r line; do

        for text in "$@"; do
            line="${line//${text}/$CENSOR_TEXT}"
        done

        printf "%s\n" "$line"

    done

}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Only execute the following if the commit is made to the `master` or `develop` branches
if [ "$TRAVIS_BRANCH" == "master" ]; then
    GIT_DESTINATION = $GIT_MASTER
else if [ "$TRAVIS_BRANCH" == "develop" ]; then
    GIT_DESTINATION = $GIT_DEVELOP
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

main "$@" \
    &> >(remove_sensitive_information "$GH_USER_EMAIL" "$GIT_USER_NAME" "$GIT_PASSWORD")