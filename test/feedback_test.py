import unittest
import requests
import threading

# Create a class that inherits from unittest.TestCase
class FeedbackCase(unittest.TestCase):
    url = 'http://localhost:8080/feedback'

    def test_full_req(self):
        body = {
                    'name' : 'foo bar',
                    'email' : 'foo@gmail.com',
                    'root' : 'عمل',
                    'message' : 'there is an issue with your form 11'
                }

        res = requests.post(self.url, json=body)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.text, "Thank you for your feedback, it has been processed")

    def test_diff_root(self):
        body = {
                    'name' : 'foo bar',
                    'email' : 'foo@gmail.com',
                    'root' : 'كتب',
                    'message' : 'there is an issue with your form 11'
                }

        res = requests.post(self.url, json=body)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.text, "Thank you for your feedback, it has been processed")

    def test_partial_req(self):
        body = {
                    'root' : 'عمل',
                    'message' : 'there is an issue with your form 11'
                }

        res = requests.post(self.url, json=body)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.text, "Thank you for your feedback, it has been processed")

    def test_no_root(self):
        body = {
                    'name' : 'foo bar',
                    'email' : 'foo@gmail.com',
                    'message' : 'there is an issue with your form 11'
                }

        res = requests.post(self.url, json=body)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.text, "Sorry, there is no root field")

    def test_no_message(self):
        errorNoMessage = {
                    'root' : 'عمل',
                    'name' : 'foo bar',
                }

        res = requests.post(self.url, json=errorNoMessage)
        self.assertEqual(res.status_code, 400)
        self.assertEqual(res.text, "Sorry, there is no message field")

# Run the tests
if __name__ == '__main__':
    unittest.main()
