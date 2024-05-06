document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";

  document
    .querySelector("#compose-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      fetch("/emails", {
        method: "POST",
        body: JSON.stringify({
          recipients: document.querySelector("#compose-recipients").value,
          subject: document.querySelector("#compose-subject").value,
          body: document.querySelector("#compose-body").value,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          // Print result
          console.log(result);
          load_mailbox("sent");
        });
    });
}

function load_mailbox(mailbox) {
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      console.log(emails);
      if (emails.length == 0) {
        document.querySelector("#emails-view").innerHTML +=
          "<p>This mailbox is empty.</p>";
      } else {
        emails.forEach((email) => {
          const onemail = document.createElement("div");
          if (email.read) {
            onemail.style.backgroundColor = "#e0e0e0";
          }
          onemail.innerHTML = `<div class="border border-primary" style="display: flex;"><b>${email.sender}</b> &nbsp;&nbsp; ${email.subject} <div style="margin-left: auto;">${email.timestamp}</div></div>`;

          document.querySelector("#emails-view").append(onemail);
          onemail.addEventListener("click", function () {
            const openmail = `<h2><b><i>Subject: </i></b>${
              email.subject
            }</h2><h4><b><i>Sender: </i></b>${
              email.sender
            }</h4><h4><b><i>Recipients: </i></b>${
              email.recipients
            }</h4><h6><i>${email.timestamp}</i></h6><hr><p>${
              email.body
            }</p><hr><button id="reply" class="btn btn-sm btn-outline-primary mx-2">Reply</button><button id="archive" class="btn btn-sm btn-outline-primary">${
              email.archived ? "Unarchive" : "Archive"
            }</button>`;
            document.querySelector("#emails-view").innerHTML = openmail;
            if (mailbox == "sent") {
              document.querySelector("#archive").remove();
            }
            // also mark this email as read.
            fetch(`/emails/${email.id}`, {
              method: "PUT",
              body: JSON.stringify({
                read: true,
              }),
            });
            document
              .querySelector("#reply")
              .addEventListener("click", function () {
                console.log("reply clicked");
                compose_email();
                document.querySelector("#compose-recipients").value =
                  email.sender;
                if (email.subject.slice(0, 4) == "Re: ") {
                  document.querySelector(
                    "#compose-subject"
                  ).value = `${email.subject}`;
                } else {
                  document.querySelector(
                    "#compose-subject"
                  ).value = `Re: ${email.subject}`;
                }
                const body = document.querySelector("#compose-body");
                body.value = `\n\nOn ${email.timestamp} ${email.sender} wrote:\n\n ${email.body}`;
                body.focus();
                body.selectionStart = 0;
                body.selectionEnd = 0;
              });
            document
              .querySelector("#archive")
              .addEventListener("click", function () {
                fetch(`/emails/${email.id}`, {
                  method: "PUT",
                  body: JSON.stringify({
                    archived: email.archived ? false : true,
                  }),
                }).then((response) => load_mailbox("inbox"));
              });
          });
        });
      }
    });

  // document.querySelector("#emails-view").append();
}
