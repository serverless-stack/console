import { AppStore } from "$/data/app";
import { AccountStore } from "$/data/aws";
import { StageStore } from "$/data/stage";
import { createSubscription } from "$/providers/replicache";
import {
  Button,
  Fullscreen,
  Row,
  Stack,
  Tag,
  Text,
  theme,
  utility,
} from "$/ui";
import { IconApp } from "$/ui/icons/custom";
import type { Stage } from "@console/core/app";
import { styled } from "@macaron-css/solid";
import { Link } from "@solidjs/router";
import { For, createEffect, createMemo } from "solid-js";

const Root = styled("div", {
  base: {
    width: "100%",
    maxWidth: 768,
  },
});

const List = styled("div", {
  base: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "start",
    gap: theme.space[4],
  },
});

const Card = styled("div", {
  base: {
    borderRadius: theme.borderRadius,
    border: `1px solid ${theme.color.divider.base}`,
  },
});

const CardHeader = styled("div", {
  base: {
    ...utility.row(0.5),
    alignItems: "center",
    padding: theme.space[4],
    borderBottom: `1px solid ${theme.color.divider.base}`,
  },
});

export function Overview() {
  const accounts = createSubscription(AccountStore.list, []);
  const stages = createSubscription(StageStore.list, []);
  createEffect(() => console.log(accounts()));
  return (
    <Fullscreen>
      <Root>
        <Stack space="4">
          <Row vertical="center" horizontal="between">
            <Text size="lg" weight="medium">
              Overview
            </Text>
            <Button color="secondary">Add AWS Account</Button>
          </Row>
          <List>
            <For each={accounts()}>
              {(account) => {
                const children = createMemo(() =>
                  stages().filter((stage) => stage.awsAccountID === account.id)
                );
                return (
                  <Card>
                    <CardHeader>
                      <Text code size="mono_sm" color="dimmed">
                        ID:
                      </Text>
                      <Text code size="mono_sm" color="dimmed">
                        {account.accountID}
                      </Text>
                    </CardHeader>
                    <div>
                      <For
                        each={children().sort((a, b) =>
                          a.appID.localeCompare(b.appID)
                        )}
                      >
                        {(stage) => <StageCard stage={stage} />}
                      </For>
                    </div>
                  </Card>
                );
              }}
            </For>
          </List>
        </Stack>
      </Root>
    </Fullscreen>
  );
}

const StageRoot = styled(Link, {
  base: {
    ...utility.row(2),
    alignItems: "center",
    padding: theme.space[4],
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.color.divider.base}`,
    transition: `background-color ${theme.colorFadeDuration} ease`,
    ":hover": {
      backgroundColor: theme.color.background.hover,
    },
    selectors: {
      "&:first-child": {
        borderTop: "none",
      },
    },
  },
});

const StageIcon = styled("div", {
  base: {
    flex: "0 0 auto",
    width: 16,
    height: 16,
    color: theme.color.icon.secondary,
  },
});

interface StageCardProps {
  stage: Stage.Info;
}
function StageCard(props: StageCardProps) {
  const app = createSubscription(() => AppStore.fromID(props.stage.appID));
  return (
    <StageRoot href={`${app()?.name}/${props.stage.name}`}>
      <Row space="2" vertical="center">
        <StageIcon>
          <IconApp />
        </StageIcon>
        <Row space="1" vertical="center">
          <Text line size="base" weight="medium" leading="normal">
            {app()?.name}
          </Text>
          <Text size="base" color="dimmed">
            /
          </Text>
          <Text line size="base" weight="medium" leading="normal">
            {props.stage.name}
          </Text>
        </Row>
      </Row>
      <Tag style="outline">{props.stage.region}</Tag>
    </StageRoot>
  );
}