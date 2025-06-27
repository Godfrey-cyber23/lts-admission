import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import dataProvider from './dataProvider';
import authProvider from './authProvider';
import { AdmissionList, AdmissionEdit } from './admissions';
import { UserList, UserEdit } from './users';
import Dashboard from './Dashboard';
import LoginPage from "./LoginPage";

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    loginPage={LoginPage}
    requireAuth
  >
    {(permissions) => [
      // Resources available to all admins
      <Resource
        name="admissions"
        list={AdmissionList}
        edit={AdmissionEdit}
        show={AdmissionShow}
      />,
      
      // Only super admins can manage users
      permissions === 'superadmin' && (
        <Resource
          name="users"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
        />
      ),
      
      // Custom routes
      <CustomRoutes>
        <Route path="/reports" element={<ReportsPage />} />
      </CustomRoutes>
    ]}
  </Admin>
);

export default App;