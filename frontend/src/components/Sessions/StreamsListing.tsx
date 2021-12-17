import React from 'react';
import Card from '../Cards/Card';
import {CardSize} from '../Cards/CardUtils';
import {StreamsProps} from './StreamUtils';
import './StreamsListing.scss';
import SessionsListing from './SessionsListing';

const StreamsListing: React.FC<StreamsProps> = ({streams}) => {
  return (
    <div className="stream-listing">
      {streams ? (
        streams.map(s => {
          return (
            <Card size={CardSize.Large} key={s.uuid}>
                <>
                    <h2>{s.title}</h2>
                    <SessionsListing sessions={s.sessions} />
                </>
            </Card>
          );
        })
      ) : (
        <p>No Streams Found</p>
      )}
    </div>
  );
};

export default StreamsListing;
