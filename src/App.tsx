import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, Map, NotFound } from "./pages";
import { Main } from "./layouts";
import CoursesListing from "./pages/courses/CoursesListing";
import { useGlobalProvider } from "./context/Provider";
import EventLayout from "./pages/events/EventLayout";
import EventListing from "./pages/events/EventListing";
import EventCreate from "./pages/events/EventCreate";
import CoursesContentListing from "./pages/courses/content/SectionListing";
import CoursesContentCreate from "./pages/courses/content/SectionCreate";
import { loadStripe } from "@stripe/stripe-js";
import CreatePaymentIntent from "./components/stripe/CreatePaymentIntent";
import ContactUsListing from "./pages/contact-us/ContactUsListing";
import CategoryLayout from "./pages/category/CategoryLayout";
import CategoryListing from "./pages/category/CategoryListing";
import CategoryCreate from "./pages/category/CategoryCreate";
import TopicLayout from "./pages/topic/TopicLayout";
import TopicCreate from "./pages/topic/TopicCreate";
import TopicListing from "./pages/topic/TopicListing";
import TechnologyLayout from "./pages/technology/TechnologyLayout";
import TechnologyListing from "./pages/technology/TechnologyListing";
import TechnologyCreate from "./pages/technology/TechnologyCreate";
import ContentListing from "./pages/content/ContentListing";
import CategoryEdit from "./pages/category/CategoryEdit";
import ContentCreate from "./pages/content/ContentCreate";
import ContentEdit from "./pages/content/ContentEdit";
import CollageEdite from "./pages/colleges/CollageEdit";
import CollageListing from "./pages/colleges/CollageListing";
import CollageEdit from "./pages/colleges/CollageEdit";
import CoursesLayout from "./pages/courses/CoursesLayout";
import CoursesDetails from "./pages/courses/CoursesDetails";
import CoursesCreate from "./pages/courses/CoursesCreate";

import SectionTompreyCoode from "./pages/courses/content/SectionTompreyCoode";
import LecturesListing from "./pages/courses/content/lectures/LecturesListing";
import LecturesEdit from "./pages/courses/content/lectures/LecturesCreate";
import LecturesCreate from "./pages/courses/content/lectures/LecturesCreate";
import CoursesEdit from "./pages/courses/CoursesEdit";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY as string);

function App() {
  const { authState } = useGlobalProvider();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {authState?.accessToken ? (
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<Map />} />
          <Route path="/completion" element={<Map />} />

          <Route
            path="/checkout/:courses_id"
            element={<CreatePaymentIntent stripe={stripePromise} />}
          />

          {/* Contents  */}
          <Route path="/content/page/1" element={<ContentListing />} />
          <Route path="/content/create" element={<ContentCreate />} />
          <Route path="/content/:id/edit" element={<ContentEdit />} />

          Catergory 
          <Route path="/category/:id/edit" element={<CategoryEdit />} />
          <Route path="/category/create" element={<CategoryCreate />} />



            {/* courses */}

          <Route path="/courses" element={<CoursesLayout />}>
            <Route
              path="/courses/:courses_id/view"
              element={<CoursesDetails />}
            />
            <Route
              path="/courses/:courses_id/sections/page/:pagination"
              element={<CoursesContentListing />}
            />
           
            <Route
              path="/courses/:courses_id/sections/create"
              element={<SectionTompreyCoode />}
            />
           
            <Route
              path="/courses/page/:pagination"
              element={<CoursesListing />}
            />
            <Route path="/courses/:id/edit" element={<CoursesEdit />} />

            <Route path="/courses/create" element={<CoursesCreate />} />
          </Route>


          <Route path="/lectures/:section_id/page/:pagination" element={<LecturesListing />} />

          <Route
              path="/lectures/:section_id/create"
              element={<LecturesCreate/>}
            />
          <Route path="/events" element={<EventLayout />}>
            <Route path="/events/page/:pagination" element={<EventListing />} />
            <Route path="/events/create" element={<EventCreate />} />
          </Route>
          <Route path="/category" element={<CategoryLayout />}>
            <Route
              path="/category/page/:pagination"
              element={<CategoryListing />}
            />
            <Route path="/category/create" element={<CategoryCreate />} />
          </Route>
          <Route path="/topic" element={<TopicLayout />}>
            <Route path="/topic/page/:pagination" element={<TopicListing />} />
            <Route path="/topic/create" element={<TopicCreate />} />
          </Route>

          <Route path="/technology" element={<TechnologyLayout />}>
            <Route
              path="/technology/page/:pagination"
              element={<TechnologyListing />}
            />
            <Route path="/technology/create" element={<TechnologyCreate />} />
          </Route>

          <Route
            path="/contact-us/page/:pagination"
            // element={<ContactUsListing />}
            element={<ContactUsListing />}
          />
          <Route
            path="colleges/page/:pagination"
            element={<CollageListing />}
            // element={<ContactUsListing />}
          />
          <Route path="/collage/:id/edit" element={<CollageEdit />} />
         

          <Route
            path="/contants/page/:pagination"
            // element={<ContactUsListing />}
            element={<ContentListing />}
          />
        </Route>
      ) : (
        <>
          <Route path="*" element={<NotFound />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
      {/* <Route path="/500" element={<SomethingWentWrong />} /> */}
    </Routes>
  );
}

export default App;
