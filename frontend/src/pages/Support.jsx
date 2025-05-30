import React, { useState } from 'react';
import '../styles/Support.css';


function Support() {
 const [formData, setFormData] = useState({
   fullName: '',
   email: '',
   subject: '',
   message: ''
 });


 const [isSubmitting, setIsSubmitting] = useState(false);
 const [showThankYou, setShowThankYou] = useState(false);
 const [tickets, setTickets] = useState([]);
 const [errors, setErrors] = useState({});
 const [faqOpen, setFaqOpen] = useState(null);


 const subjectOptions = [
   'Order Issue',
   'Product Inquiry',
   'Account Issue',
   'Other'
 ];


 const faqs = [
   {
     question: 'How do I track my order?',
     answer: 'You can track your order by logging into your account and visiting the Orders page. Each order has a tracking number that you can use to monitor its status.'
   },
   {
     question: 'What is your return policy?',
     answer: 'We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Please contact our support team to initiate a return.'
   },
   {
     question: 'How can I change or cancel my order?',
     answer: 'You can modify or cancel your order within 24 hours of placing it. Please contact our customer support team immediately for assistance.'
   },
   {
     question: 'What payment methods do you accept?',
     answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.'
   },
   {
     question: 'How long does shipping take?',
     answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery. International shipping may take 7-14 business days.'
   }
 ];


 const validateForm = () => {
   const newErrors = {};
   if (!formData.fullName.trim()) {
     newErrors.fullName = 'Please enter your full name';
   }
   if (!formData.email.trim()) {
     newErrors.email = 'Please enter your email';
   } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
     newErrors.email = 'Please enter a valid email';
   }
   if (!formData.subject) {
     newErrors.subject = 'Please select a subject';
   }
   if (!formData.message.trim()) {
     newErrors.message = 'Please enter your message';
   }
   setErrors(newErrors);
   return Object.keys(newErrors).length === 0;
 };


 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
   if (errors[name]) {
     setErrors(prev => ({
       ...prev,
       [name]: ''
     }));
   }
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
  
   if (!validateForm()) {
     return;
   }


   setIsSubmitting(true);


   try {
     await new Promise(resolve => setTimeout(resolve, 1000));


     const ticket = {
       id: Date.now(),
       ...formData,
       status: 'Open',
       createdAt: new Date().toISOString()
     };


     setTickets(prev => [...prev, ticket]);
     console.log('Support ticket submitted:', ticket);
     setShowThankYou(true);
    
     setFormData({
       fullName: '',
       email: '',
       subject: '',
       message: ''
     });


     setTimeout(() => {
       setShowThankYou(false);
     }, 3000);


   } catch (error) {
     console.error('Error submitting ticket:', error);
     setErrors({
       submit: 'Failed to submit ticket. Please try again.'
     });
   } finally {
     setIsSubmitting(false);
   }
 };


 const toggleFaq = (index) => {
   setFaqOpen(faqOpen === index ? null : index);
 };


 return (
   <div className="support-container">
     <div className="support-header">
       <h1>Customer Support</h1>
       <p>We're here to help! Please fill out the form below and we'll get back to you as soon as possible.</p>
     </div>


     <div className="support-content">
       <div className="contact-section">
         <h2>Contact Us</h2>
         {showThankYou ? (
           <div className="thank-you-message">
             <i className="bi bi-check-circle-fill"></i>
             <h3>Thank You!</h3>
             <p>Your message has been received. We'll get back to you soon.</p>
           </div>
         ) : (
           <form onSubmit={handleSubmit} className="contact-form">
             <div className="form-group">
               <label htmlFor="fullName">Full Name</label>
               <input
                 type="text"
                 id="fullName"
                 name="fullName"
                 value={formData.fullName}
                 onChange={handleInputChange}
                 className={errors.fullName ? 'error' : ''}
                 placeholder="Enter your full name"
               />
               {errors.fullName && <span className="error-message">{errors.fullName}</span>}
             </div>


             <div className="form-group">
               <label htmlFor="email">Email</label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={formData.email}
                 onChange={handleInputChange}
                 className={errors.email ? 'error' : ''}
                 placeholder="Enter your email"
               />
               {errors.email && <span className="error-message">{errors.email}</span>}
             </div>


             <div className="form-group">
               <label htmlFor="subject">Subject</label>
               <select
                 id="subject"
                 name="subject"
                 value={formData.subject}
                 onChange={handleInputChange}
                 className={errors.subject ? 'error' : ''}
               >
                 <option value="">Select a subject</option>
                 {subjectOptions.map(option => (
                   <option key={option} value={option}>
                     {option}
                   </option>
                 ))}
               </select>
               {errors.subject && <span className="error-message">{errors.subject}</span>}
             </div>


             <div className="form-group">
               <label htmlFor="message">Message</label>
               <textarea
                 id="message"
                 name="message"
                 value={formData.message}
                 onChange={handleInputChange}
                 className={errors.message ? 'error' : ''}
                 placeholder="Enter your message"
                 rows="5"
               />
               {errors.message && <span className="error-message">{errors.message}</span>}
             </div>


             {errors.submit && (
               <div className="error-message submit-error">
                 {errors.submit}
               </div>
             )}


             <button
               type="submit"
               className="submit-btn"
               disabled={isSubmitting}
             >
               {isSubmitting ? (
                 <>
                   <i className="bi bi-arrow-repeat spin"></i>
                   Submitting...
                 </>
               ) : (
                 <>
                   <i className="bi bi-send"></i>
                   Send Message
                 </>
               )}
             </button>
           </form>
         )}
       </div>


       <div className="info-section">
         <div className="tickets-section">
           <h2>Recent Support Tickets</h2>
           {tickets.length === 0 ? (
             <p className="no-tickets">No support tickets yet.</p>
           ) : (
             <div className="tickets-list">
               {tickets.map(ticket => (
                 <div key={ticket.id} className="ticket-card">
                   <div className="ticket-header">
                     <h3>{ticket.subject}</h3>
                     <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                       {ticket.status}
                     </span>
                   </div>
                   <div className="ticket-info">
                     <p><strong>From:</strong> {ticket.fullName}</p>
                     <p><strong>Email:</strong> {ticket.email}</p>
                     <p><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                   </div>
                   <div className="ticket-message">
                     <p>{ticket.message}</p>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>


         <div className="faq-section">
           <h2>Frequently Asked Questions</h2>
           <div className="faq-list">
             {faqs.map((faq, index) => (
               <div
                 key={index}
                 className={`faq-item ${faqOpen === index ? 'open' : ''}`}
               >
                 <div
                   className="faq-question"
                   onClick={() => toggleFaq(index)}
                 >
                   <h3>{faq.question}</h3>
                   <span className="faq-icon">
                     {faqOpen === index ? '−' : '+'}
                   </span>
                 </div>
                 <div className="faq-answer">
                   <p>{faq.answer}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>


     <div className="support-info">
       <div className="info-card">
         <i className="bi bi-telephone"></i>
         <h3>Phone Support</h3>
         <p>Available 24/7</p>
         <p>+1 (555) 123-4567</p>
       </div>


       <div className="info-card">
         <i className="bi bi-envelope"></i>
         <h3>Email Support</h3>
         <p>Response within 24 hours</p>
         <p>support@awe.electronics.com</p>
       </div>


       <div className="info-card">
         <i className="bi bi-chat"></i>
         <h3>Live Chat</h3>
         <p>Available 9 AM - 5 PM EST</p>
         <p>Click to start chat</p>
       </div>
     </div>
   </div>
 );
}


export default Support;