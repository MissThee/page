import Cookies from 'js-cookie';
import Global from 'src/docviewer/utils/global';

const tokenKey = 'tokenKey';
const repositoryKey = 'repositoryKey';
const docRootKey = 'docRootKey';
const userKey = 'userKey';
const isManualLoginKey = 'isManualLoginKey';
export default {
  token: {
    getTokenValue() {
      let value = Cookies.get(tokenKey);
      value = !value || value === 'undefined' ? undefined : value;
      if (!value) {
        return Global.DEFAULT_TOKEN;
      }
      return value;
    },
    setTokenValue(value) {
      return Cookies.set(tokenKey, value, { expires: 10000 });
    },
    removeTokenValue() {
      return Cookies.remove(tokenKey);
    }
  },
  repository: {
    getRepositoryValue() {
      let value = Cookies.get(repositoryKey);

      return !value || value === 'undefined' ? Global.DEFAULT_REPOSITORY : value;
    },
    setRepositoryValue(value) {
      return Cookies.set(repositoryKey, value, { expires: 10000 });
    },
    removeRepositoryValue() {
      return Cookies.remove(repositoryKey);
    }
  },
  docRoot: {
    getDocRootValue() {
      let value = Cookies.get(docRootKey);
      return !value || value === 'undefined' ? Global.DEFAULT_DOC_ROOT : value;
    },
    setDocRootValue(value) {
      return Cookies.set(docRootKey, value, { expires: 10000 });
    },
    removeDocRootValue() {
      return Cookies.remove(docRootKey);
    }
  },
  user: {
    getUserValue() {
      let value = Cookies.get(userKey);
      return value === 'undefined' ? undefined : value;
    },
    setUserValue(value) {
      return Cookies.set(userKey, value, { expires: 10000 });
    },
    removeUserValue() {
      return Cookies.remove(userKey);
    }
  },
  isManualLogin: {
    getIsManualLogin() {
      return Cookies.get(isManualLoginKey);
    },
    setIsManualLogin(value) {
      return Cookies.set(isManualLoginKey, value);
    },
  }
};

