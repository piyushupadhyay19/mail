# Email Client Single Page Application

This is a single-page email client application built using JavaScript and Python's Django framework.

## Features

### Send Mail
- Users can compose and send emails.
- Upon submission of the email composition form, the email is sent via a POST request to the server.

### Mailbox
- Users can view their inbox, sent mailbox, or archived emails.
- Upon visiting a specific mailbox, the application queries the API for the latest emails in that mailbox.
- Unread emails appear with a white background, while read emails appear with a gray background.

### View Email
- Users can click on an email to view its content.
- Upon viewing an email, it is marked as read via a PUT request to the server.

### Archive and Unarchive
- Users can archive and unarchive emails.

### Reply
- Users can reply to emails.
- When viewing an email, the user can click the "Reply" button to reply to the email.
- The composition form is pre-filled with the original email's sender as the recipient, the subject prefixed with "Re:", and the body containing a quote of the original email's content.

## Live Demo

This project is live at [herokuapp](https://mail50-0fcd5232b46d.herokuapp.com/)


