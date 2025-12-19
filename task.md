# Improvements to Node.js Management Section

## Proposed Enhancements 1
I want to improve the “Manage Services” → Node.js section with the following enhancements:

- Display which Node.js version is currently set as the default.
- Remove duplicate Node.js versions (for example: 22.21.1, 22.17.0) and display only one entry per major version.
- Revise the version display to show only the major version number instead of the full version.
- Add a “Set Default” action for each Node.js version to allow quick changes.
    - Remove the existing “Set Default Version” section.
    - Show a confirmation modal before changing the default Node.js version.
- Add an action to remove or delete an installed Node.js version.
- Move the “Install Node.js” button to the right side of the “Manage Node.js” title.
    - When clicked, display a modal that allows the user to input the Node.js version to install.

## Proposed Enhancements 2
- Store the nodejs versions to local storage so that they persist across sessions.
- Make sure that everywhere used the nodejs version list, needs to fetch from local storage
- Update nodejs version list after any install or delete action to reflect the current state.


## Feedback
- Group actions (Set Default, Delete) into a dropdown menu to save space.
- We don't see which Node.js version is currently set as default.
- We don't see any progress when installing a new Node.js version.
- Delete nodejs doesn't work
    - Error: Error: props.onUninstallNode is not a function

## Feedback 2
- It would be helpful to show the currently active Node.js version in the list.
- Delete nodejs version
    - I deleted nodejs version 4, but they still show up in the list maybe a refresh is needed after deletion? or there duplicates? or maybe a bug?
- When installing a new Node.js version, it would be great to have a output log to see the progress and any potential errors.

## Feedback 3
- Delete function for Node.js versions is not working as expected.
- Do you think the nodejs version list is correct? I deleted version 4 many times but it still shows up in the list. I think I never install that version why it shows up?


