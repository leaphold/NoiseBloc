'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

function ContactForm() {

  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [message, setMessage] = useState(''); 

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('name:', name);
    console.log('email:', email);
    console.log('message:', message);
  }

  return (
    <form className="contactForm" onSubmit={onSubmit}>
      <label>
        Name:
        <br></br>
        <input 
          type="text" 
          name="name" 
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
      </label>
      <label>
        Email:
        <br></br>
        <input 
          type="text" 
          name="email" 
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Message:
        <br></br>
        <textarea 
          name="message" 
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
        />
      </label>
      <button type="submit">Send</button>
    </form>
  );
}

export default ContactForm;
