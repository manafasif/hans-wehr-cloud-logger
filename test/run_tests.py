import unittest
import threading
import subprocess
import os
import signal
from feedback_test import FeedbackCase

print("Starting Development Server")

lock = threading.Lock()
finished = False
pid = None

def start_dev_server():
    global pid
    lock.acquire()
    command = ["yarn", "run", "dev"]
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True, preexec_fn=os.setsid)
    pid = process.pid
    assert process.stdout is not None
    # TODO handle case in which this is not printed, there should be some clean up
    for line in process.stdout:
        if("info: API listening port 8080" in line.strip()):
            lock.release()
            print("Development Server Started")

def cleanup(*args):
    global pid
    print ("cleaning")
    assert pid is not None
    os.killpg(os.getpgid(pid), signal.SIGTERM)  # Send the signal to all the process groups

signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

# Create a test suite
def suite():
    test_loader = unittest.TestLoader()

    # Add the test cases to the suite
    test_suite = test_loader.loadTestsFromTestCase(FeedbackCase)

    return test_suite

if __name__ == '__main__':

    # I should probably change this
    dev_server_thread = threading.Thread(target=start_dev_server)
    dev_server_thread.start()
    lock.acquire()

    runner = unittest.TextTestRunner(verbosity=2)
    test_suite = suite()
    runner.run(test_suite)

    # kill the thread lol
    Finished = True
    print("End of test suite, killing server")
    assert pid is not None
    os.killpg(os.getpgid(pid), signal.SIGTERM)  # Send the signal to all the process groups
    dev_server_thread.join(timeout=1)
