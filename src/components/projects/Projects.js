import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Fuse from 'fuse.js';
import Card from './ProjectCard.js';
import axios from 'axios';
import '../../styles/projects.scss';

const searchOptions = {
  keys: ['ProjectName', 'ProjectDesc', 'MentorName', 'ProjectTags'],
  // the threshold value should be decreased to be more strict in getting search results
  threshold: 0.5,
};

export default function Projects() {
  const [searchText, setSearchText] = useState('');

  const [allProjects, setAllProjects] = useState([]);
  const [searchedProjects, setSearchedProjects] = useState([]);

  const URL = 'https://kwoc.metamehta.me/project/all';

  useEffect(() => {
    axios
      .get(URL)
      .then((response) => {
        setAllProjects(
          response.data.sort((a, b) =>
            a.ProjectDesc.length + a.ProjectTags.length <
            b.ProjectDesc.length + b.ProjectTags.length
              ? 1
              : -1
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleSearch(e) {
    const fuse = new Fuse(allProjects, searchOptions);
    setSearchText(e.target.value);
    const results = fuse.search(e.target.value).map((i) => i.item);
    setSearchedProjects(results);
  }

  let displayedProjects = [];
  if (searchText === '') displayedProjects = allProjects;
  else displayedProjects = searchedProjects;

  return (
    <div className='projects'>
      <Navbar />
      <section class='hero is-medium is-danger is-bold' id='projects'>
        <div class='hero-body'>
          <div class='container'>
            <h1 class='title' style={{ color: 'white' }}>
              Projects
            </h1>
          </div>
        </div>
      </section>

      <div className='container'>
        <div class='field'>
          <div class='control'>
            <input
              class='input is-primary is-medium'
              type='text'
              placeholder='Search projects using project name, topics and mentor'
              onChange={handleSearch}
            ></input>
          </div>
        </div>

        <div class='columns is-multiline is-centered'>
          {displayedProjects.map((project, id) => (
            <div key={id} class='column has-text-centered is-4'>
              <Card
                name={project.ProjectName}
                desc={project.ProjectDesc}
                mentor={project.MentorName}
                tags={JSON.parse(project.ProjectTags)}
                mentorId={project.MentorEmail}
                mentorUsername={project.MentorUsername}
                projectLink={project.ProjectRepoLink}
                commLink={project.ProjectComChannel}
                length={project.MentorName.length}
              ></Card>
            </div>
          ))}
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}
