import { projects } from 'App';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className="flex p-8">
        {projects.map((item) => (
          <Link to={item.path} key={item.id} className="mr-4 last:mr-0">
            <div className={classnames('p-4 bg-white rounded-md shadow-md')}>
              {item.name}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
