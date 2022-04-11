import { FC } from 'react';
import { Link } from 'react-router-dom';

const pages = [
  {
    id: 0,
    path: '/first-project',
    name: 'First Project',
  },
  {
    id: 1,
    path: '/equirectangular',
    name: 'Equirectangular',
  },
  {
    id: 2,
    path: '/skybox',
    name: 'Skybox',
  },
];

const Home: FC = () => {
  return (
    <>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>
            <Link to={page.path}>{page.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
