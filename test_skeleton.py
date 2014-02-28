import socket
from subprocess import Popen, TimeoutExpired, call
import tempfile
import sys


def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('localhost', 0))
    _, port = s.getsockname()
    s.close()
    return port


class test():
    def __init__(self, f):
        self.f = f

    def __call__(self, *args, **kwargs):
        print(self.f.__name__ + '...', end="")
        passed, out, err = self.f()
        print('PASSED' if passed else 'FAILED')
        if not passed:
            print(out)
            print(err)


def exec_timeout(cmd, timeout):
    out = tempfile.TemporaryFile()
    err = tempfile.TemporaryFile()
    proc = Popen(cmd, cwd='/tmp/testapp', stdout=out, stderr=err, shell=True)
    try:
        proc.communicate(timeout=timeout)
    except TimeoutExpired:
        proc.terminate()
        proc.communicate()
    out.seek(0)
    err.seek(0)
    return out.read(), err.read()


def expect(expect, out, err):
    if expect not in out.decode():
        return False, out.decode(), err.decode()
    if len(err):
        return False, out.decode(), err.decode()
    return True, out.decode(), err.decode()


@test
def test_brunch_watch():
    out, err = exec_timeout(["brunch w -s -p {}".format(get_free_port())], timeout=3)
    return expect('application started on', out, err)


@test
def test_npm_test():
    out, err = exec_timeout(["npm test"], timeout=3)
    return expect('Executed 2 of 2\x1b[32m SUCCESS\x1b', out, err)


def must_call(cmd, shell):
    sts = call(cmd, shell=shell)
    if sts != 0:
        print("ABNORMAL FAILURE: {}".format(cmd))
        sys.exit(sts)

@test
def test_brunch_new():
    sts = call("brunch new . /tmp/testapp", shell=True)
    passed = sts == 0
    return passed, '', ''


def run_tests():
    must_call("rm -rf /tmp/testapp", shell=True)
    test_brunch_new()
    test_brunch_watch()
    test_npm_test()


if __name__ == '__main__':
    run_tests()
