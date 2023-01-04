import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Segment, Accordion, Header, Icon, Image, List } from "semantic-ui-react";

const MetaPanel = () => {
  const stream = useSelector((state) => state.stream);
  const userPosts = useSelector((state) => state.users.posts);
  
  const [activeIndex, setIndex] = useState(0);

  const setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setIndex(newIndex);
  };

  const formatCount = num => (num > 1 || num === 0 ? `${num} posts` : `${num} post`);

  const displayTopPosters = posts =>
    Object.entries(posts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, val], i) => (
        <List.Item key={i}>
          <Image avatar src={val.avatar} />
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0, 5);

  if (stream.isPrivateStream) return null;

  return (
    <Segment loading={isEmpty(stream.currentStream)}>
      <Header as="h3" attached="top">
        About # {stream.currentStream && stream.currentStream.name}
      </Header>
      <Accordion styled attached="true">
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={setActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="info" />
          Stream Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {stream.currentStream && stream.currentStream.details}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={setActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user circle" />
          Top Posters
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <List>{userPosts && displayTopPosters(userPosts)}</List>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={setActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="pencil alternate" />
          Created By
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <Header as="h3">
            <Image
              circular
              src={
                stream.currentStream.createdBy &&
                stream.currentStream.createdBy.avatar
              }
            />
            {stream.currentStream.createdBy &&
              stream.currentStream.createdBy.name}
          </Header>
        </Accordion.Content>
      </Accordion>
    </Segment>
  );
};

export default MetaPanel;
