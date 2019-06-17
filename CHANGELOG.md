# Change Log

## [1.2.9] - 2019-06-17
### Added
- Information message if there are no notes found past the current cursor position [#6](https://gitlab.com/fooxly/vscode-todo-lens/issues/6)
- Translation keys for all the texts
- Exlude all the files and folders that are in a `.gitignore` or `.ignore` file [#3](https://gitlab.com/fooxly/vscode-todo-lens/issues/3)
- Notes per function and class [#7](https://gitlab.com/fooxly/vscode-todo-lens/issues/7)

### Changed
- Dropdown now only shows the items within its range [#9](https://gitlab.com/fooxly/vscode-todo-lens/issues/9)
- Made the title object for a group possible to be a string and object for in the `settings.json`

## [1.2.7] - 2019-06-14
### Added
- possibility to move to the next note in the file
- possibility to move to the previous note in the file

### Changed
- Making modules use the same base class for settings and updating
- Updated the command titles to `TODO Lens:`
- Commands to a seperate class

## [1.2.6] - 2019-06-14
### Changed
- Updated the README for a more in depth overview of the extension
- Showing the selection more to the top of the file when it needs to be scrolled instead of the very bottom
- Made alle the section headers the correct naming (Some where **New** instead of **Added**)
- Fixed a bug where the dropdown showed more values than the lens because of the case sensitive property

## [1.2.5] - 2019-06-14
### Added
- Made the lens and highlighting more to 1
- Case sensitive groups based on the keywords case sensitive boolean

### Changed
- Updated readme properties and previews

## [1.2.4] - 2019-06-14
### Added
- Different order types in the dropdown

### Changed
- Small bug in the README

## [1.2.3] - 2019-06-13
### Added
- Case sensitive seperate for each keyword in the syntax highlighter

## [1.2.2] - 2019-06-13
### Added
- Option to disable the syntax highlighting

## [1.2.1] - 2019-06-13
### Added
- Added rating, version and installs button to the README
- Added the syntax highlighting to the README


## [1.2.0] - 2019-06-13
### Added
- Syntax highlighting

## [1.1.0] - 2019-06-13
### Changed
- Improved searching for keywords
- Fixed the replace error if there were 0 items

## [1.0.6] - 2019-06-13
### Changed
- Readme updated to reposity name change

## [1.0.5] - 2019-06-13
### Added
- Get a list of all the TODOs in the file by clicking on the code lens
- Added command to view all notes and TODOs in a dropdown

## [1.0.2] - 2019-06-13
### Added
- New logo

## [1.0.1] - 2019-06-13
### Changed
- Updated README for the Visual Studio Marketplace
- Default configurations are now setup correctly

## [1.0.0] - 2019-06-13
### Added
- Custom keywords and sections
- Options to disable a lens when there are no items
- Option to make the keywords case sensitive
