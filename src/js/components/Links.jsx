import React, { Component } from 'react';

class Links extends Component {
  state = {
    links: [
      { name: 'github', value: 'https://github.com/artisawesm/initializr' },
      { name: 'dev.to', value: 'https://dev.to/artisawesm' },
    ],
  };
  render() {
    const links = [...this.state.links];
    return (
      <React.Fragment>
        {links.map(v => (
          <a className='link' target='_blank' key={v.name} href={v.value}>
            {v.name}
          </a>
        ))}
      </React.Fragment>
    );
  }
}

export default Links;
