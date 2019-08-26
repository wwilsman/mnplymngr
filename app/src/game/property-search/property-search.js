import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';

import { useProperties } from '../../helpers/hooks';

import { Container, Section } from '../../ui/layout';
import { Text } from '../../ui/typography';
import { Input } from '../../ui/forms';
import Button from '../../ui/button';
import Icon from '../../ui/icon';
import Property from '../property';
import styles from './property-search.css';

PropertySearch.propTypes = {
  player: PropTypes.shape({
    token: PropTypes.string
  }),
  onPurchase: PropTypes.func,
  onRent: PropTypes.func
};

export default function PropertySearch({
  player,
  onPurchase,
  onRent
}) {
  let [ search, setSearch ] = useState('');
  let [ focused, setFocused ] = useState(false);
  let properties = useProperties(player?.token ?? 'bank');

  let fuse = useMemo(() => (
    new Fuse(properties, {
      keys: ['name', 'group']
    })
  ), [properties]);

  let result = useMemo(() => {
    let res = search && fuse.search(search);
    return !!res && !!res.length && res[0];
  }, [fuse, search]);

  return properties.length === 0 ? (
    <Section justify="center">
      <Text
        upper
        color="darker"
        className={styles['not-found']}
        data-test-property-empty
      >
        No owned properties
      </Text>
    </Section>
  ) : (
    <Container className={styles.root}>
      <Section flex="none" row collapse>
        <Input
          value={search}
          onChangeText={setSearch}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={styles.input}
          placeholder="property or group name"
          label="Search properties"
        />

        {(focused || search) && (
          <Button
            inline
            style="icon"
            onClick={() => setSearch('')}
            data-test-property-search-clear
          >
            <Icon color="alert" name="close"/>
          </Button>
        )}
      </Section>

      <Section justify="center">
        {search ? (
          result ? (
            <Property
              property={result}
              className={styles.property}
              onPurchase={onPurchase}
              onRent={onRent}
              showDetails
            />
          ) : (
            <Text
              upper
              color="darker"
              className={styles['not-found']}
              data-test-property-not-found
            >
              {'No matching'}<br/>{'properties'}
            </Text>
          )
        ) : properties.map(prop => (
          <Property
            key={prop.id}
            property={prop}
            className={styles.property}
          />
        ))}
      </Section>
    </Container>
  );
}
