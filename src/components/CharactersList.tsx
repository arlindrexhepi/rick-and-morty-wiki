import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCharacters } from '../api/charactersAPI';
import randomArray from '../utils/randomArray';
import { ICharacterAPI } from '../interfaces/ICharacter';
import { Grid, GridItem, useToast, Flex, Text, Button } from '@chakra-ui/react';
import Card from '../components/ui/Card';
import CardSkeleton from './ui/CardSkeleton';

const CharactersList = () => {
  const [page, setPage] = useState(1);
  const {
    data: characters,
    isError,
    isFetching,
    isSuccess,
    isPreviousData,
  } = useQuery<ICharacterAPI>(
    ['characters', { page }],
    () => getCharacters({ page }),
    {
      keepPreviousData: true,
      staleTime: 120000,
    }
  );
  const toast = useToast();
  const limit = 20;

  const rndmArray = useMemo(() => randomArray(limit), [limit]);

  useEffect(() => {
    if (isError) {
      toast({
        status: 'error',
        duration: 4000,
        title: 'No data!',
        description: 'Something went wrong!',
        isClosable: true,
      });
    }
  }, [isError]);

  return (
    <Grid minH="600px">
      {isError && (
        <Flex flexDirection="column" alignItems="center" rowGap="2">
          <Text>There is no data at the moment, please try again later! </Text>
        </Flex>
      )}
      {!isFetching ? (
        <>
          <Grid
            my={['4', '4', '6']}
            templateColumns={[
              '"repeat(1,1fr)"',
              'repeat(1,1fr)',
              'repeat(2,1fr)',
            ]}
            gap="6"
          >
            {isSuccess &&
              characters &&
              characters.results.map((el) => {
                return (
                  <GridItem key={el.id}>
                    <Card
                      id={el.id}
                      image={el.image}
                      location={el.location}
                      origin={el.origin}
                      name={el.name}
                      species={el.species}
                      status={el.status}
                    />
                  </GridItem>
                );
              })}
          </Grid>
          <Flex
            justifyContent="center"
            my="4"
            alignItems="center"
            columnGap="4"
          >
            <Button
              colorScheme="teal"
              size="md"
              disabled={page === 1}
              onClick={() => setPage((t) => Math.max(t - 1, 0))}
            >
              Prev
            </Button>
            {characters && (
              <Text fontSize="xl" fontWeight="600">
                {page} / {characters.info.pages} Pages
              </Text>
            )}
            <Button
              colorScheme="teal"
              size="md"
              disabled={isPreviousData || !characters?.info.next}
              onClick={() => {
                if (!isPreviousData || characters?.info.next) {
                  setPage((t) => t + 1);
                }
              }}
            >
              Next
            </Button>
          </Flex>
        </>
      ) : (
        <Grid
          my={['4', '4', '6']}
          templateColumns={[
            '"repeat(1,1fr)"',
            'repeat(1,1fr)',
            'repeat(2,1fr)',
          ]}
          gap="6"
        >
          {isFetching &&
            rndmArray.map((el: number) => {
              return (
                <GridItem key={el}>
                  <CardSkeleton />
                </GridItem>
              );
            })}
        </Grid>
      )}
    </Grid>
  );
};

export default CharactersList;
