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
  {
    id: 3,
    path: '/solar-system',
    name: 'Solar System',
  },
];

const Home: FC = () => {
  return (
    <>
      <div className="max-w-5xl p-4 mx-auto">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <li key={page.id}>
              <Link
                to={page.path}
                className="block p-4 bg-white rounded-md shadow-lg"
              >
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
