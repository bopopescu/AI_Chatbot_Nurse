
Chatbot integrated into Facebook Messenger's APIs for the Hackxplore Hackathon.

After a patient is diagonsed with Coronary Heart Disease, physicians can use our app to monitor the patient's symptoms. Our chatbot will prompt the patient every day for any symptoms and our AI will calculate what % they are at risk. 

##Structure:
index.js // Handles integration with Facebook Messenger APIs and represents the chatbot interface and what the patients interact with
- AI // Classifier to process training data and uses RESTful APIs to take an input testing set
- dashboard // CMS for doctors to view live patient data
