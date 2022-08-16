document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Send composed e-mail
  document.querySelector('#compose-form').addEventListener('submit', send_mail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'none';  
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load all mails related to this inbox  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(email => {

      // Create div for 1 e-mail
      const email_box = document.createElement('div');
      email_box.classList.add('mail_frame');
      email_box.setAttribute("id", `${email.id}`);
      document.querySelector('#emails-view').append(email_box);        
      
      // Change backgroundcolor based on read / not read
      if (email.read === true) {
        email_box.style.backgroundColor = 'LightGray';
      };
      
      // Create and populate HTML elements for e-mail
      const mail_info = [email.sender, email.subject, email.timestamp]
      for (let i = 0; i < mail_info.length; i++) {         
        var span = document.createElement('span');
        span.innerHTML = mail_info[i];
        span.classList.add(`mailbox_column_${i}`)
        email_box.append(span);
      };

      // Load content of e-mail
      email_box.addEventListener('click', function() {
        view_mail(email.id);
      });
    });
  })

  // Catch any errors and log them to the console
  .catch(error => {
    console.log('Error:', error);
  });
};

function send_mail(event) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value,
        read: false
    })
  })
  .then(response => response.json())
  .then(result => {

      // Print result & load mailbox
      console.log(result) & load_mailbox('sent');
  })
  event.preventDefault();  
};

// Open a specific e-mail
function view_mail(id) {

  // Show e-mails content & hide mailboxes
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').innerHTML = '';
  document.querySelector('#email-view').style.display = 'block'; 

  // Get e-mail data
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    // Mark e-mail as 'read'
    if (email.read === false) {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
      })

      // Handle empty response
      .then((response) => response.text());
    };

    // Create and populate HTML-elements
    const mail_info = [email.subject, email.sender, email.recipients, email.timestamp];
    const mail_deco = ["Subject: ", "From: ", "To: ", "Timestamp: "];
    for (let i = 0; i < mail_info.length; i++) {
      var b = document.createElement('b');            
      var div = document.createElement('div');
      b.innerHTML = mail_deco[i];
      div.innerHTML = mail_info[i];
      div.prepend(b);
      document.getElementById('email-view').append(div);
    };

    // Create a line & body
    var line = document.createElement('hr');
    var body = document.createElement('div');
    body.classList.add('email_body');
    body.innerHTML = email.body;

    // Create reply button
    var reply_button = document.createElement('button');
    reply_button.type = 'submit';
    reply_button.className = 'btn btn-sm btn-outline-primary';
    reply_button.setAttribute('id', 'reply');
    reply_button.innerHTML = 'Reply';

    // Reply button event
    reply_button.addEventListener('click', function() {

        // Show compose view and hide other views
        document.querySelector('#email-view').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
      
        // Pre-fill the composition fields
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-body').value = `\nOn ${email.timestamp} ${email.sender} wrote:\n${email.body}\n`;
        if (email.subject.substring(0, 4) == 'Re: ') {
          document.querySelector('#compose-subject').value = email.subject;
        } else {
          document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
        }
    });

    // Create archivation button
    var archive_button = document.createElement('button');
    archive_button.type = 'submit';
    archive_button.className = 'btn btn-sm btn-outline-primary';
    archive_button.setAttribute('id', 'archive');
    if (email.archived === false) {
      archive_button.innerHTML = 'Archive';
    } else {
      archive_button.innerHTML = 'Unarchive';
    };
    document.getElementById('email-view').append(reply_button, archive_button, line, body);

    // Archivation button event
    archive_button.addEventListener('click', function() {
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: !email.archived
        })
      })

      // Handle empty response & load mailbox
      .then((response) => response.text() & load_mailbox('inbox'));
    });
  })

  // Catch any errors and log them to the console
  .catch(error => {
    console.log('Error:', error);
  });    
};
