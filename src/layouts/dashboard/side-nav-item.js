import NextLink from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  ButtonBase,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import { useEffect, useState } from "react";

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title } = props;
  const [idItem, setIdItem] = useState("");
  const [open, setOpen] = useState(false);
  const [iconChange, setIconChange] = useState(props.iconOpened);
  const handleClick = () => {
    setOpen(!open);
    setIconChange(!open ? props.iconClosed : props.iconOpened);
    setIdItem("");
  };

  const handleClickSub = (id) => {
    setIdItem(id);
  };

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li>
      {props.subNav === null ? (
        <ButtonBase
          sx={{
            alignItems: "center",
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: "16px",
            pr: "16px",
            py: "6px",
            textAlign: "left",
            width: "100%",
            ...(active && {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            }),
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
            },
          }}
          {...linkProps}
        >
          {icon && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...(active && {
                  color: "primary.main",
                }),
              }}
            >
              {icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: "neutral.400",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(active && {
                color: "common.white",
              }),
              ...(disabled && {
                color: "neutral.500",
              }),
            }}
          >
            {title}
          </Box>
        </ButtonBase>
      ) : (
        <Box>
          <ButtonBase
            sx={{
              alignItems: "center",
              borderRadius: 1,
              display: "flex",
              justifyContent: "flex-start",
              pl: "16px",
              pr: "16px",
              py: "6px",
              textAlign: "left",
              width: "100%",
              ...(active && {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
              }),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
              },
            }}
            onClick={handleClick}
          >
            {icon && (
              <Box
                component="span"
                sx={{
                  alignItems: "center",
                  color: "neutral.400",
                  display: "inline-flex",
                  justifyContent: "center",
                  mr: 2,
                  ...(active && {
                    color: "primary.main",
                  }),
                }}
              >
                {icon}
              </Box>
            )}
            <Box
              component="span"
              sx={{
                color: "neutral.400",
                flexGrow: 1,
                fontFamily: (theme) => theme.typography.fontFamily,
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "24px",
                whiteSpace: "nowrap",
                ...(active && {
                  color: "common.white",
                }),
                ...(disabled && {
                  color: "neutral.500",
                }),
              }}
            >
              {title}
            </Box>
            {icon && (
              <Box
                component="span"
                sx={{
                  alignItems: "center",
                  color: "neutral.400",
                  display: "inline-flex",
                  justifyContent: "center",
                  mr: 2,
                  ...(active && {
                    color: "primary.main",
                  }),
                }}
              >
                {iconChange}
              </Box>
            )}
          </ButtonBase>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {props.subNav.map((item, index) => {
                return (
                  <ButtonBase
                    sx={{
                      alignItems: "center",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      pl: "15%",
                      pr: "16px",
                      py: "6px",
                      textAlign: "left",
                      width: "100%",
                      ...(idItem != item.path
                        ? false
                        : true && {
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                          }),
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                    onClick={() => {
                      handleClickSub(item.path);
                    }}
                    {...{
                      component: NextLink,
                      href: item.path,
                    }}
                    key={index}
                  >
                    {icon && (
                      <Box
                        component="span"
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          mr: 2,
                          ...(idItem != item.path
                            ? false
                            : true && {
                                color: "primary.main",
                              }),
                        }}
                      >
                        {item.icon}
                      </Box>
                    )}
                    <Box
                      component="span"
                      sx={{
                        color: "neutral.400",
                        flexGrow: 1,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        ...(idItem != item.path
                          ? false
                          : true && {
                              color: "common.white",
                            }),
                        ...(idItem === item.path
                          ? false
                          : true && {
                              color: "neutral.500",
                            }),
                      }}
                    >
                      {item.title}
                    </Box>
                  </ButtonBase>
                );
              })}
            </List>
          </Collapse>
        </Box>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
};
