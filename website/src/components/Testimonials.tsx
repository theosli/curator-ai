import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  Expandable,
  ExpandableButton,
  ExpandableItems,
} from '@/components/Expandable'
import kookaburra from '@/images/kookaburra.png'

const testimonials = [
  [
    {
      content:
        'Never have I been so much up to date with my newsletters.',
      author: {
        name: 'Antonio Littel',
        role: 'Frontend Developer',
        image: kookaburra,
      },
    },
    {
      content:
        'Simple. Clear. Best tool for my daily dose of information.',
      author: {
        name: 'Lynn Nolan',
        role: 'Growth Marketer',
        image: kookaburra,
      },
    },
    {
      content:
        'I love the simplicity of the design. It’s easy to navigate and it’s easy to find what I’m looking for.',
      author: {
        name: 'Krista Prosacco',
        role: 'Professional Designer',
        image: kookaburra,
      },
    },
  ],
  [
    {
      content:
        'What a way to find every newsletter I need in one place. I love it!',
      author: {
        name: 'Cameron Considine',
        role: 'Entrepreneur',
        image: kookaburra,
      },
    },
    {
      content:
        'I’m so glad I found this. I’ve been looking for a way to keep up with all the newsletters I subscribe to and this is perfect.',
      author: {
        name: 'Regina Wisoky',
        role: 'Design Student',
        image: kookaburra,
      },
    },
    {
      content:
        'Curator AI was really the missing piece in my workflow. I can’t believe how much time I was wasting before I found this.',
      author: {
        name: 'Vernon Cummerata',
        role: 'UI Engineer',
        image: kookaburra,
      },
    },
  ],
  [
    {
      content:
        'I’ve been using Curator AI for a few weeks now and I can’t imagine my life without it. It’s so easy to use and it’s so helpful.',
      author: {
        name: 'Steven Hackett',
        role: 'Bootcamp Instructor',
        image: kookaburra,
      },
    },
    {
      content:
        'Best discovery of my year so far. I love Curator AI.',
      author: {
        name: 'Carla Schoen',
        role: 'Startup Founder',
        image: kookaburra,
      },
    },
    {
      content:
        'All I can say is wow — Curator AI is amazing.',
      author: {
        name: 'Leah Kiehn',
        role: 'Creative Director',
        image: kookaburra,
      },
    },
  ],
]

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
  return (
    <section className="py-8 sm:py-10 lg:py-16">
      <Container className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
          Some kind words from our users...
        </h2>
        <p className="mt-4 text-lg tracking-tight text-slate-600">
            We discussed and experimented with different people to make subscribe
            the tool we were crafting was exactly what they needed. Here are some
            of the testimonials we received from them.
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
        <ExpandableButton>Read more testimonials</ExpandableButton>
      </Expandable>
    </section>
  )
}
