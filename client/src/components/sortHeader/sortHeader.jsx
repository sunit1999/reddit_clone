import { Chip, Chips, createStyles, Group } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  iconWrapper: {
    ref: getRef("iconWrapper"),
  },

  checked: {
    backgroundColor: `${theme.colors.blue[6]} !important`,
    color: theme.white,

    [`& .${getRef("iconWrapper")}`]: {
      color: theme.white,
    },
  },
}));

const SortHeader = ({ value, setValue, label }) => {
  const { classes } = useStyles();
  if (!label) label = 'Comments';

  return (
    <Group sx={(theme) => ({ backgroundColor: theme.colors.dark[9] })} p={"sm"}>
      <Chips
        classNames={classes}
        size="xs"
        variant="outline"
        value={value}
        onChange={setValue}
      >
        <Chip value="createdAt">New</Chip>
        <Chip value="totalVotes">Most Votes</Chip>
        <Chip value={`total${label}`}>Most {label}</Chip>
      </Chips>
    </Group>
  );
};

export default SortHeader;
