import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({
  streamName,
  numUniqueUsers,
  handleSearchChange,
  searchLoading,
  searchTerm,
  privateStream,
  handleStar,
  streamStarred
}) => {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {streamName}
          {!privateStream && (
            <Icon
              onClick={()=>handleStar(streamStarred)}
              name={streamStarred ? "star" : "star outline"}
              color={streamStarred ? "yellow" : "black"}
            />
          )}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>

      {/* Channel Search Input */}
      <Header floated="right">
        <Input
          loading={searchLoading}
          onChange={handleSearchChange}
          size="mini"
          icon="search"
          name="searchTerm"
          value={searchTerm}
          placeholder="Search Messages"
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
