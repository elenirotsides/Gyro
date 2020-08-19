<img src="https://img.icons8.com/all/500/gyroscope.png" width="128">

# Gyro

CS 546 Final Project

## Setting up your enviornment

1. Clone the package
   `git clone https://github.com/elenirotsides/Gyro.git`

2. Install dependencies
   `npm install`

3. Initialize the database
   `node src/scripts/initdb`

4. Run the local server
   `npm start`

## Logging into Gyro

1. Users can create a login by selecting `Register Here` from the homepage

    - Users will provide a first name, last name, email, and password to register
    - Upon registering, users will automatically login

2. If a User already has an account, they can login using their email and password from the home screen.

## Viewing Your Kanban Board

1. The kanban board has four columns: Pending, In Progress, Review, and Done. Each column lists the tasks that currently have that status.

2. Drag a task from one column to another to update the status of that task

## Creating a Task

1. Select `Add a task` in the bottom left corner

2. Enter the Task name and description

3. Optionally, enter any tags to add seperated by a comma

4. Optionally, select which user to assign the task to. If no user is selected, this task will be assigned to _No One_

5. Select `Submit` to create the task. This task will be added to 'Pending'

## Viewing a Task

1. Tasks display on the kanban board with the task name, associated tags, the created, and who is assigned the task

2. To view additional details, a clicks on the task to display the data below the kanban board

## Commenting on a Task

1. View task comments by clicking on the task in the kanban board - comments will display beneath the task data

2. To add a comment, write the comment text in the provided textarea and select `Add new comment`. This will add the comment and associate with the user that created it.

## Editing a Task

1. Click `edit` on the task in the kanban board

2. Change any required text fields

3. Add a tag by typing in a string of 24 or fewer characters per tag, seperating tags by a comma

4. Remove a tag by clicking the `x` next to the tag name

5. Change the user assigned to the task by selecting the dropdown - all users with accounts will populate in the dropdown

6. Click `sumbit` to save your changes

## Deleting a Task

1. Select `delete` from the Task in the kanban board

## Searching for a Task

1. Use the search bar in the top-left corner to filter by keyword.

    - This can be used to search for task names or tags

2. Select `clear` to remove the filter

## Logging Out

1. Select `Logout` from the top-right corner

2. This logs out the current user and redirects to the login page
