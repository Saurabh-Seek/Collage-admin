
import _superagent, { search } from "superagent";
import SuperagentPromise from "superagent-promise";
const superagent = SuperagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_API_ROOT;

const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;

let token: any = "";
const tokenPlugin = (req: any) => {
  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }
};

const requests = {
  del: (url: string) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url: string) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  patch: (url: string, body: any) =>
    superagent
      .patch(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url: string, body: any) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  file: (url: string, key: string, file: any) =>
    superagent
      .post(`${API_ROOT}${url}`)
      .attach(key, file)
      .use(tokenPlugin)
      .then(responseBody),
};

const Auth = {
  list: () => requests.get(`category`),
  get: (id: string) => requests.get(`category/${id}`),
  login: (item: any) => requests.post(`signin`, item),
};

const Category = {
  list: () => requests.get(`categories`),
  get: (id: string) => requests.get(`categories/${id}`),
  update: (id: string, value: string) => requests.patch(`categories/${id}`, value),
  deletd: (id: string) => requests.del(`categories/${id}`),
  create: (item: any) => requests.post(`categories`, item),
};

const Topic = {
  list: (category_id: string) => requests.get(`topics/${category_id}`),
  getList: () => requests.get(`topics`),
  delete: (id: string) => requests.del(`topics/${id}`),
  getData: () => requests.get(`topics`),
  get: (category_id: string, information: string) =>
    requests.get(`topics/${category_id}/${information}`),
  create: (item: any) =>
    requests.post(`topics`, item),
};


const Technology = {
  list: (topic: string) => requests.get(`technologies/${topic}`),
  get: (topic: string, information: string) =>
    requests.get(`technologies/${topic}/${information}`),
  delete: (id: string) => requests.del(`technologies/${id}`),
  getData: () => requests.get(`technologies`),
  create: (topic: string, item: any) =>
    requests.post(`technologies/${topic}`, item),

  createData: (item: any) =>
    requests.post(`technologies`, item),
};

const Events = {
  list: () => requests.get(`events`),
  get: (id: string) => requests.get(`events/${id}`),
  create: (item: any) => requests.post(`events`, item),
};

const Courses = {
  list: () => requests.get(`courses`),
  get: (id: string) => requests.get(`courses/${id}`),
  create: (items: any) => requests.post(`courses`, items),
  update: (id:string, items: any) => requests.patch(`courses/${id}`,items),
  buy: (course_id: string) =>
    requests.post(`courses/create-payment-intent`, { course_id }),
};

const Sections = {
  list: (id: string) => requests.get(`sections/${id}`),
  get: (id: string) => requests.get(`sections/${id}`),
  create: (course_id: string, items: any) =>
    requests.post(`sections/${course_id}`, items),
};

const Content = {
  list: () => requests.get(`contents`),
  get: () => requests.get(`contents`),
  create: (item: any) => requests.post(`contents`, item),
  update: (id: string, items: any) => requests.patch(`contents/${id}`, items),
  delete: (id: string) => requests.del(`contents/${id}`),
};
const ContactUs = {
  list: () => requests.get(`contact-us`),
  get: (id: string) => requests.get(`contact-us/${id}`),
  create: (item: any) => requests.post(`contact-us`, item),
  update: (id:string, data: any) => requests.patch(`contact-us/${id}`,data),
  delete: (id: string) => requests.del(`contact-us/${id}`),

};
const colleges = {
  list: () => requests.get(`colleges`),
  get: (id: string) => requests.get(`colleges/${id}`),
  create: (item: any) => requests.post(`colleges`, item),
  update: (id:string, items: any) => requests.patch(`colleges/${id}`,items),
  delete: (id: string) => requests.del(`colleges/${id}`),

};


const Lectures = {
  // list: (section_id:string) => requests.get(`lectures/${section_id}`),
  list: (id: string) => requests.get(`lectures/${id}`),
  get: (id: string) => requests.get(`lectures/${id}`),
  // create: (item: any) => requests.post(`lectures`, item),
  update: (id:string, items: any) => requests.patch(`lectures/${id}`,items),
  delete: (id: string) => requests.del(`lectures/${id}`),

  create: (section_id: string, items: any) =>
    requests.post(`sections/${section_id}`, items),
};

const seekSolutionApi = {
  API_ROOT,
  Auth,
  Category,
  Topic,
  Technology,
  Content,
  Events,
  ContactUs,
  colleges,
  Lectures,
  Courses,
  Sections,
  token,
  encode,
  setToken: (_token?: string) => {
    token = _token;
  },
};

export default seekSolutionApi;
