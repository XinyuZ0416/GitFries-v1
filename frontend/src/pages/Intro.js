import React from 'react';
import { Link } from 'react-router-dom'

export default function Intro(){
    return (
      <div className='intro-page'>
        <h1 className='intro-page-title'> GitFries: Your Gateway to Issue Collaboration</h1><br/>

        <div className='intro-content'>
          <h2>What is GitFries?</h2>
          <p>
            GitFries is a platform to link developers seeking help for their repository issues with programmers looking to improve skills and gain valuable hands-on project experience.<br/><br/>
            You can post and link issues from GitHub/ GitLab/ Gitee/..., categorize them by difficulties and languages, and contributors will find tasks that match their skill level and interests.<br/>
          </p>

          <h2>How does it work?</h2>
          <div className='intro-img-container'>
            <img className='intro-img' src="/images/intro1.jpg" alt="intro1"/>
            <img className='intro-img' src="/images/intro2.jpg" alt="intro2"/>
            <img className='intro-img' src="/images/intro3.jpg" alt="intro3"/>
            <img className='intro-img' src="/images/intro4.jpg" alt="intro4"/>
          </div>

          <h2>Resources</h2>
          <p>Icons from <Link to='https://www.flaticon.com' target='_blank'>Flaticon</Link></p>
          <p>Art font from <Link to='https://www.fontspace.com/flying-bird-font-f87637' target='_blank'>Fontspace</Link></p>
          <p>Typeface font from <Link to='https://fontsource.org/fonts/ubuntu-mono' target='_blank'>Fontsource</Link></p>
        </div>
      </div>
    )
  }
  