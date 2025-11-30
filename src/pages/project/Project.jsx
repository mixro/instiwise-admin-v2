import { Link, useLocation } from 'react-router-dom';
import './project.css'
import { useGetProjectByIdQuery } from '../../services/projectsApi';
import moment from 'moment';

const Project = () => {
    const location = useLocation();
    const projectId = location.pathname.split("/")[2];
    
    const { data: project, isLoading, isFetching, error, } = useGetProjectByIdQuery(projectId);
    
    if (isLoading) return <div>Loading project...</div>;
    if (error) return <div>Error Loading project...</div>;

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Psroject Details</h1>
        <Link to="/create-project">
          <button className="productAddButton">Create</button>
        </Link>
      </div>

      <div className="productTop">
          <div className="productTopLeft">
            <div className="roomImage">
              <img src={project?.img} alt="PR" />
            </div>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                  <span className="productName">{project.title}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">Owner:</span>
                      <span className="productInfoValue">{project.userId?.username}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Category:</span>
                      <span className="productInfoValue">{project?.category}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Problem:</span>
                      <span className="productInfoValue">{project?.problem}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Duration:</span>
                      <span className="productInfoValue">{project?.duration}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Status:</span>
                      <span className="productInfoValue">{project?.status}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Likes:</span>
                      <span className="productInfoValue">{project?.likes.length}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Created:</span>
                      <span className="productInfoValue">{moment(project.createdAt).fromNow()}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">Updated:</span>
                      <span className="productInfoValue">{moment(project.updatedAt).fromNow()}</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="project-bottom">
        <div className="projectBottom-item">
            <h3>Description</h3>
            <p>{project.description}</p>
        </div>
        <div className="projectBottom-item">
            <h3>Collaborators</h3>
            {project.collaborators.map((item) => (
                <div className="projectList" key={item}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Goals</h3>
            {project.goals.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Resources</h3>
            {project.resources.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Budget</h3>
            {project.budget.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Scope</h3>
            {project.scope.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Plan</h3>
            {project.plan.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
        <div className="projectBottom-item">
            <h3>Challenges</h3>
            {project.plan.map((item, index) => (
                <div className="projectList" key={index}>
                    <p>{item}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Project