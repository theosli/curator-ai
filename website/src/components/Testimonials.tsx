import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import kookaburra from '@/images/kookaburra.png'
import { useTranslation } from 'react-i18next';


function Testimonial({
  author,
  children,
}: {
  author: { name: string; role: string; image: ImageProps['src'] }
  children: React.ReactNode
}) {
  return (
    <figure className="rounded-4xl p-8 shadow-md ring-1 ring-slate-900/5">
      <blockquote>
        <p className="text-lg tracking-tight text-slate-900 before:content-['“'] after:content-['”']">
          {children}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center">
        <div className="overflow-hidden rounded-full bg-slate-50">
          <Image
            className="h-12 w-12 object-cover"
            src={author.image}
            alt=""
            width={48}
            height={48}
          />
        </div>
        <div className="ml-4">
          <div className="text-base font-medium leading-6 tracking-tight text-slate-900">
            {author.name}
          </div>
          <div className="mt-1 text-sm text-slate-600">{author.role}</div>
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    [
      {
        content: t('person1.testimonial'),
        author: {
          name: t('person1.name'),
          role: t('person1.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person2.testimonial'),
        author: {
          name: t('person2.name'),
          role: t('person2.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person3.testimonial'),
        author: {
          name: t('person3.name'),
          role: t('person3.role'),
          image: kookaburra,
        },
      }
    ],
    [
      {
        content: t('person4.testimonial'),
        author : {
          name: t('person4.name'),
          role: t('person4.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person5.testimonial'),
        author : {
          name: t('person5.name'),
          role: t('person5.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person6.testimonial'),
        author : {
          name: t('person6.name'),
          role: t('person6.role'),
          image: kookaburra,
        },
      }
    ],
    [
      {
        content: t('person7.testimonial'),
        author : {
          name: t('person7.name'),
          role: t('person7.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person8.testimonial'),
        author : {
          name: t('person8.name'),
          role: t('person8.role'),
          image: kookaburra,
        },
      },
      {
        content: t('person9.testimonial'),
        author : {
          name: t('person9.name'),
          role: t('person9.role'),
          image: kookaburra,
        },
      },
    ],
  ]
  return (
    <section className="py-8 sm:py-10 lg:py-16">
      <Container className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
        {t('testimonialTitle')}
        </h2>
        <p className="mt-4 text-lg tracking-tight text-slate-600">
        {t('testimonialSubtitle')}            
        </p>
      </Container>
      <Expandable className="group mt-16">
        <ul
          role="list"
          className="mx-auto grid max-w-2xl grid-cols-1 gap-8 px-4 lg:max-w-7xl lg:grid-cols-3 lg:px-8"
        >
          {testimonials
            .map((column) => column[0])
            .map((testimonial, testimonialIndex) => (
              <li key={testimonialIndex} className="lg:hidden">
                <Testimonial author={testimonial.author}>
                  {testimonial.content}
                </Testimonial>
              </li>
            ))}
          {testimonials.map((column, columnIndex) => (
            <li
              key={columnIndex}
              className="hidden group-data-[expanded]:list-item lg:list-item"
            >
              <ul role="list">
                <ExpandableItems>
                  {column.map((testimonial, testimonialIndex) => (
                    <li
                      key={testimonialIndex}
                      className={clsx(
                        testimonialIndex === 0 && 'hidden lg:list-item',
                        testimonialIndex === 1 && 'lg:mt-8',
                        testimonialIndex > 1 && 'mt-8',
                      )}
                    >
                      <Testimonial author={testimonial.author}>
                        {testimonial.content}
                      </Testimonial>
                    </li>
                  ))}
                </ExpandableItems>
              </ul>
            </li>
          ))}
        </ul>
        <ExpandableButton>{t('readMoreTestimonials')}</ExpandableButton>
      </Expandable>
    </section>
  )
}
