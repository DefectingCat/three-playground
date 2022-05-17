import { Link } from 'react-router-dom';

const projects = [
  {
    id: 0,
    path: '/hello-cube',
    name: 'Hello cube',
  },
];

const Home = () => {
  return (
    <>
      <div className="flex p-8">
        {projects.map((item) => (
          <Link to={item.path} key={item.id}>
            <div className="p-4 bg-white rounded-md shadow-md">{item.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
